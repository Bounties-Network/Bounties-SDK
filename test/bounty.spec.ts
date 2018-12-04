import Nock from 'nock'
import Web3 from 'web3'
import ipfsMini from 'ipfs-mini'
import { map, findIndex } from 'lodash';

import { FakeHttpProvider } from './helpers/fakeHttpProvider'
import fixtures from './fixtures'
import Bounties from '../src/bounties'
import BigNumber from 'bignumber.js';
import { Provider } from 'web3/providers';
import { fileURLToPath } from 'url';
import { Difficulty, BountyData } from '../src/types';

import { interfaces } from '../src/contracts/interfaces'



const buildTxHash = (hashId: number) => {
    let hash = '0x7000000000000000000000000000000000000000000000000000000000000000'.slice(
        0, 66 - hashId.toString().length
    )

    return hash + hashId.toString()
}

const buildAddress = (id: number) => {
    let address = '0xADD3255000000000000000000000000000000000'.slice(
        0, 42 - id.toString().length
    )

    return Web3.utils.toChecksumAddress(address + id.toString())
}

const USER_ADDRESS = buildAddress(100)
const FACTORY_ADDRESS = buildAddress(200)
const BOUNTY_ADDRESS = buildAddress(300)
const GAS = '0x9c40'
const GAS_PRICE = '0x5'
const IPFS_HASH = 'QmP8QJoTxvxnFm3WSsdG3SdVDSvktJkcmrQ7PmY3Q2D7RX'
const TX_OPTIONS = {
    from: USER_ADDRESS.toLowerCase(),
    to: BOUNTY_ADDRESS.toLowerCase(),
    gas: GAS,
    gasPrice: GAS_PRICE
}
const BOUNTY_DATA = {
    title: 'Bounty Title',
    body: 'Bounty body!!',
    categories: ['javascript', 'research'],
    expectedNumberOfRevisions: 1,
    hasPrivateFulfillments: true,
    difficulty: 'Beginner' as Difficulty,
    attachments: {
        ipfsHash: IPFS_HASH,
        ipfsFileName: 'pic.jpg',
        url: 'https://bounties.network',
    },
    metadata: {
        platform: 'bounties',
        schemaVersion: 0.2,
        schemaName: 'standard'
    }
}

// web3
const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io'))
// incorrect web3 types
const encodeParameter = (type: string | object, parameter: any) => (web3.eth.abi.encodeParameter as Function)(type, parameter).replace('0x', '')
const encodeParameters = (types: string[], parameters: any[]) => web3.eth.abi.encodeParameters(types, parameters)
const methodSignature = (method: string) => interfaces.StandardBounty[findIndex(interfaces.StandardBounty, item => item.name == method)].signature.replace('0x', '')

// mock ipfs
ipfsMini.prototype.addJSON = (data: object, callback: Function ) => callback(null, 'QmP8QJoTxvxnFm3WSsdG3SdVDSvktJkcmrQ7PmY3Q2D7RX')
const ipfs = new ipfsMini({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

// mock http
Nock.disableNetConnect()
const nock = Nock('https://api.bounties.network/').log(console.log)

const metadata = {
    platform: 'bounties-network',
    schemaVersion: 0.2,
    schemaName: 'standard'
}
const bounties = new Bounties(web3, ipfs, FACTORY_ADDRESS, metadata)
const bountyContract = bounties.bountyClient(BOUNTY_ADDRESS).methods

describe('bounty module', () => {
    describe.skip('offchain', () => {
        describe('load', () => {
            it('should load bounty with specified id', async () => {
                nock.get('/bounty/1/').reply(200, fixtures.bounty)

                const bounty = await bounties.bounties.load((1))
                expect(bounty).toEqual(fixtures.bounty)
            })

            it('should load bounty with corrent parameters', async () => {
                const params = { platform__in: 'bounties' }
                nock.get('/bounty/1/').query(params).reply(200, fixtures.bounty)

                const bounty = await bounties.bounties.load(1, params)
                expect(bounty).toEqual(fixtures.bounty)
            })

            it('should fail if id does not exist', async () => {
                nock.get('/bounty/1234/').reply(400, fixtures.bounty);
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

        describe('create', () => {
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
                    provider.injectValidation(payload => {
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
                    })

                    provider.injectResult(buildTxHash(0))
                    provider.injectValidation(payload => {
                        expect(payload.method).toEqual('eth_getTransactionReceipt')
                    })

                    await expect(bounties.bounties.update(
                        BOUNTY_ADDRESS,
                        {
                            controller: updatedBounty.controller,
                            approvers: updatedBounty.approvers,
                            data: updatedBounty.data.object,
                            deadline: updatedBounty.deadline
                        }
                    )).resolves.toBe(buildTxHash(0))
                })


                it('should update bounty except for controller', async () => {
                    provider.injectValidation(payload => {
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
                    })

                    provider.injectResult(buildTxHash(0))
                    provider.injectValidation(payload => {
                        expect(payload.method).toEqual('eth_getTransactionReceipt')
                    })


                    await expect(bounties.bounties.update(
                        BOUNTY_ADDRESS,
                        {
                            approvers: updatedBounty.approvers,
                            data: updatedBounty.data.object,
                            deadline: updatedBounty.deadline
                        }
                    )).resolves.toBe(buildTxHash(0))
                })

                it('should update bounty except for approvers and deadline', async () => {
                    provider.injectValidation(payload => {
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
                    })

                    provider.injectResult(buildTxHash(0))
                    provider.injectValidation(payload => {
                        expect(payload.method).toEqual('eth_getTransactionReceipt')
                    })


                    await expect(bounties.bounties.update(
                        BOUNTY_ADDRESS,
                        {
                            controller: updatedBounty.controller,
                            data: updatedBounty.data.object,
                        }
                    )).resolves.toBe(buildTxHash(0))
                })

                // needs data to be returnd from getBounty()
                it.skip('should change the approvers', async () => {
                    provider.injectValidation(payload => {
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
                    })

                    provider.injectResult(buildTxHash(0))
                    provider.injectValidation(payload => {
                        expect(payload.method).toEqual('eth_getTransactionReceipt')
                    })


                    await expect(bounties.bounties.update(
                        BOUNTY_ADDRESS,
                        {
                            approvers: updatedBounty.approvers,
                        }
                    )).resolves.toBe(buildTxHash(0))
                })
            })

            describe('changeController', async () => {
                it('should change the controller', async () => {
                    provider.injectValidation(payload => {
                        expect(payload.method).toEqual('eth_sendTransaction')
                        expect(payload.params).toEqual([{
                            data: bountyContract.changeController(
                                updatedBounty.controller
                            ).encodeABI(),
                            ...TX_OPTIONS
                        }])
                    })

                    provider.injectResult(buildTxHash(0))
                    provider.injectValidation(payload => {
                        expect(payload.method).toEqual('eth_getTransactionReceipt')
                    })

                    await expect(bounties.bounties.update(
                        BOUNTY_ADDRESS,
                        { controller: updatedBounty.controller }
                    )).resolves.toBe(buildTxHash(0))
                })
            })

            describe('changeData', async () => {
                it('should change the data associated with the bounty', async () => {
                    provider.injectValidation(payload => {
                        expect(payload.method).toEqual('eth_sendTransaction')
                        expect(payload.params).toEqual([{
                            data: bountyContract.changeData(
                                updatedBounty.data.hash
                            ).encodeABI(),
                            ...TX_OPTIONS
                        }])
                    })

                    provider.injectResult(buildTxHash(0))
                    provider.injectValidation(payload => {
                        expect(payload.method).toEqual('eth_getTransactionReceipt')
                    })

                    await expect(bounties.bounties.update(
                        BOUNTY_ADDRESS,
                        { data: updatedBounty.data.object }
                    )).resolves.toBe(buildTxHash(0))
                })
            })

            describe('changeDeadline', async () => {
                it('should change the data associated with the bounty', async () => {
                    provider.injectValidation(payload => {
                        expect(payload.method).toEqual('eth_sendTransaction')
                        expect(payload.params).toEqual([{
                            data: bountyContract.changeDeadline(
                                updatedBounty.deadline.toString()
                            ).encodeABI(),
                            ...TX_OPTIONS
                        }])
                    })

                    provider.injectResult(buildTxHash(0))
                    provider.injectValidation(payload => {
                        expect(payload.method).toEqual('eth_getTransactionReceipt')
                    })

                    await expect(bounties.bounties.update(
                        BOUNTY_ADDRESS,
                        { deadline: updatedBounty.deadline }
                    )).resolves.toBe(buildTxHash(0))
                })
            })
        })

        describe('drain', () => {
            const payoutTokens = [buildAddress(0), buildAddress(1)]
            const tokenVersions = [new BigNumber(20), new BigNumber(20)]
            const tokenAmounts = [new BigNumber(10), new BigNumber(200)]

            it('should drain a bounty', async () => {
                provider.injectValidation(payload => {
                    expect(payload.method).toEqual('eth_sendTransaction')
                    expect(payload.params).toEqual([{
                        data: bountyContract.drainBounty(
                            payoutTokens,
                            map(tokenVersions, version => version.toString()),
                            map(tokenAmounts, amounts => amounts.toString())
                        ).encodeABI(),
                        ...TX_OPTIONS
                    }])
                })

                provider.injectResult(buildTxHash(0))
                provider.injectValidation(payload => {
                    expect(payload.method).toEqual('eth_getTransactionReceipt')
                    expect(payload.params).toEqual([buildTxHash(0)])
                })

                await expect(bounties.bounties.drain(
                    BOUNTY_ADDRESS,
                    payoutTokens,
                    tokenVersions,
                    tokenAmounts,
                )).resolves.toBe(buildTxHash(0))
            })
        })
    })
})