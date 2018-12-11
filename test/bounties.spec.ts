import BigNumber from 'bignumber.js';
import { map } from 'lodash';

import { bounties, bountyContract } from './utils/instances'
import { FakeHttpProvider } from './utils/fakeHttpProvider'
import { constants } from './utils/constants'
import { buildAddress, encodeParameters } from './utils/helpers'


const {
    USER_ADDRESS,
    FACTORY_ADDRESS,
    BOUNTY_ADDRESS,
    GAS,
    GAS_PRICE,
    TX_HASH,
    IPFS_HASH,
    TX_OPTIONS,
    BOUNTY_DATA,
} = constants

describe('bounty module', () => {
    describe.skip('offchain', () => {
        describe('load', () => {
            it('should load bounty with specified id', async () => {

                const bounty = await bounties.bounties.load((1))
            })

            it('should load bounty with corrent parameters', async () => {

                const bounty = await bounties.bounties.load(1)
            })

            it('should fail if id does not exist', async () => {
                await expect(bounties.bounties.load(1)).rejects.toThrow(new Error('404'))
            })
        })
    })


    describe('onchain', () => {
        let provider: FakeHttpProvider

        beforeEach(() => {
            provider = new FakeHttpProvider()
            bounties._web3.setProvider(provider)

            // inject result for web3.eth.getAccounts() calls
            provider.injectResult([USER_ADDRESS])
            provider.injectValidation(payload => {
                expect(payload.method).toEqual('eth_accounts')
            })
        })


        describe.skip('create', () => {
            it('should create bounty that pays out in ether', async () => { })
            it('should create bounty that pays out in tokens', async () => { })
        })


        describe('update', () => {
            const intitialBounty = {
                controller: buildAddress(0),
                hasPaidOut: false,
                fulfillmentsLength: 0,
                masterCopy: FACTORY_ADDRESS,
                data: {
                    object: BOUNTY_DATA,
                    hash: IPFS_HASH
                },
                approvers: [buildAddress(1)],
                deadline: Date.UTC(1970, 0, 1),
            }

            const updatedBounty = {
                controller: USER_ADDRESS,
                approvers: [buildAddress(0), buildAddress(1), buildAddress(2)],
                data: {
                    object: BOUNTY_DATA,
                    hash: IPFS_HASH
                },
                deadline: new BigNumber(new Date(2100, 9, 29).getTime() / 1000)
            }


            describe('changeBounty', () => {
                beforeEach(() => {
                    provider.injectValidation(payload => {
                        expect(payload.method).toEqual('eth_call')
                    })

                    // inject result for bounty.methods.getBounty().call()
                    provider.injectResult(
                        encodeParameters(
                            [
                                'address',
                                'bool',
                                'uint',
                                'address',
                                'address[]',
                                'uint'],
                            [
                                intitialBounty.controller,
                                intitialBounty.hasPaidOut,
                                intitialBounty.fulfillmentsLength,
                                intitialBounty.masterCopy,
                                intitialBounty.approvers,
                                intitialBounty.deadline
                            ]
                        )
                    )
                })

                it('should update all bounty values', async () => {
                    provider.injectValidation(
                        payload => {
                            expect(payload.method).toEqual('eth_sendTransaction')
                            expect(payload.params).toEqual([{
                                data: bountyContract.changeBounty(
                                updatedBounty.controller,
                                updatedBounty.approvers,
                                updatedBounty.data.hash,
                                updatedBounty.deadline.toString()
                                ).encodeABI(),
                                ...TX_OPTIONS
                            }])
                        },
                        {
                            gasPrice: GAS_PRICE,
                            txHash: TX_HASH
                        }
                    )

                    await expect(bounties.bounties.update(
                        BOUNTY_ADDRESS,
                        {
                            controller: updatedBounty.controller,
                            approvers: updatedBounty.approvers,
                            data: updatedBounty.data.object,
                            deadline: updatedBounty.deadline
                        }
                    )).resolves.toBe(TX_HASH)
                })

                it('should update bounty except for controller', async () => {
                    provider.injectValidation(
                        payload => {
                            expect(payload.method).toEqual('eth_sendTransaction')
                            expect(payload.params).toEqual([{
                                data: bountyContract.changeBounty(
                                    intitialBounty.controller,
                                    updatedBounty.approvers,
                                    updatedBounty.data.hash,
                                    updatedBounty.deadline.toString()
                                ).encodeABI(),
                                ...TX_OPTIONS
                            }])
                        },
                        {
                            gasPrice: GAS_PRICE,
                            txHash: TX_HASH
                        }
                    )

                    await expect(bounties.bounties.update(
                        BOUNTY_ADDRESS,
                        {
                            approvers: updatedBounty.approvers,
                            data: updatedBounty.data.object,
                            deadline: updatedBounty.deadline
                        }
                    )).resolves.toBe(TX_HASH)
                })

                it('should update bounty except for approvers and deadline', async () => {
                    provider.injectValidation(
                        payload => {
                            expect(payload.method).toEqual('eth_sendTransaction')
                            expect(payload.params).toEqual([{
                                data: bountyContract.changeBounty(
                                    updatedBounty.controller,
                                    intitialBounty.approvers,
                                    updatedBounty.data.hash,
                                    intitialBounty.deadline.toString(),
                                ).encodeABI(),
                                ...TX_OPTIONS
                            }])
                        },
                        {
                            gasPrice: GAS_PRICE,
                            txHash: TX_HASH
                        }
                    )

                    await expect(bounties.bounties.update(
                        BOUNTY_ADDRESS,
                        {
                            controller: updatedBounty.controller,
                            data: updatedBounty.data.object,
                        }
                    )).resolves.toBe(TX_HASH)
                })

                // needs data to be returnd from getBounty()
                it.skip('should change the approvers', async () => {
                    provider.injectValidation(
                        payload => {
                            expect(payload.method).toEqual('eth_sendTransaction')
                            expect(payload.params).toEqual([{
                                data: bountyContract.changeBounty(
                                    intitialBounty.controller,
                                    updatedBounty.approvers,
                                    intitialBounty.data.hash,
                                    intitialBounty.deadline.toString(),
                                ).encodeABI(),
                                ...TX_OPTIONS
                          }])
                        },
                        {
                            gasPrice: GAS_PRICE,
                            txHash: TX_HASH
                        }
                    )

                    await expect(bounties.bounties.update(
                        BOUNTY_ADDRESS,
                        {
                            approvers: updatedBounty.approvers,
                        }
                    )).resolves.toBe(TX_HASH)
                })
            })


            describe('changeController', async () => {
                it('should change the controller', async () => {
                    provider.injectValidation(
                        payload => {
                            expect(payload.method).toEqual('eth_sendTransaction')
                            expect(payload.params).toEqual([{
                                data: bountyContract.changeController(
                                    updatedBounty.controller
                                ).encodeABI(),
                                ...TX_OPTIONS
                            }])
                        },
                        {
                            gasPrice: GAS_PRICE,
                            txHash: TX_HASH
                        }
                    )

                    await expect(bounties.bounties.update(
                        BOUNTY_ADDRESS,
                        { controller: updatedBounty.controller }
                    )).resolves.toBe(TX_HASH)
                })
            })


            describe('changeData', async () => {
                it('should change the data associated with the bounty', async () => {
                    provider.injectValidation(
                        payload => {
                            expect(payload.method).toEqual('eth_sendTransaction')
                            expect(payload.params).toEqual([{
                                data: bountyContract.changeData(
                                    updatedBounty.data.hash
                                ).encodeABI(),
                                ...TX_OPTIONS
                            }])
                        },
                        {
                            gasPrice: GAS_PRICE,
                            txHash: TX_HASH
                        }
                    )

                    await expect(bounties.bounties.update(
                        BOUNTY_ADDRESS,
                        { data: updatedBounty.data.object }
                    )).resolves.toBe(TX_HASH)
                })
            })


            describe('changeDeadline', async () => {
                it('should change the data associated with the bounty', async () => {
                    provider.injectValidation(
                        payload => {
                            expect(payload.method).toEqual('eth_sendTransaction')
                            expect(payload.params).toEqual([{
                                data: bountyContract.changeDeadline(
                                    updatedBounty.deadline.toString()
                                ).encodeABI(),
                                ...TX_OPTIONS
                            }])
                        },
                        {
                            gasPrice: GAS_PRICE,
                            txHash: TX_HASH
                        }
                    )

                    await expect(bounties.bounties.update(
                        BOUNTY_ADDRESS,
                        { deadline: updatedBounty.deadline }
                    )).resolves.toBe(TX_HASH)
                })
            })
        })


        describe('drain', () => {
            const payoutTokens = [buildAddress(0), buildAddress(1)]
            const tokenVersions = [new BigNumber(20), new BigNumber(20)]
            const tokenAmounts = [new BigNumber(10), new BigNumber(200)]

            it('should drain a bounty', async () => {
                provider.injectValidation(
                    payload => {
                        expect(payload.method).toEqual('eth_sendTransaction')
                        expect(payload.params).toEqual([{
                            data: bountyContract.drainBounty(
                                payoutTokens,
                                map(tokenVersions, version => version.toString()),
                                map(tokenAmounts, amounts => amounts.toString())
                            ).encodeABI(),
                            ...TX_OPTIONS
                        }])
                    },
                    {
                        gasPrice: GAS_PRICE,
                        txHash: TX_HASH
                    }
                )

                await expect(bounties.bounties.drain(
                    BOUNTY_ADDRESS,
                    payoutTokens,
                    tokenVersions,
                    tokenAmounts,
                )).resolves.toBe(TX_HASH)
            })
        })
    })
})