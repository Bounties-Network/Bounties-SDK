import BigNumber from 'bignumber.js';
import { map } from 'lodash';

import { bounties, bountyContract, nock } from './utils/instances'
import fixtures from './fixtures'
import { FakeHttpProvider } from './utils/fakeHttpProvider'
import { constants } from './utils/constants'
import { prepareProvider, buildAddress, encodeParameters } from './utils/helpers'


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


describe.skip('fulfillments module', () => {
/*
    describe.skip('offchain', () => {})

    describe('onchain', () => {
        let provider: FakeHttpProvider

        beforeEach(() => {
            provider = prepareProvider()
            bounties._web3.setProvider(provider)
        })

        describe('create', () => {
            const fulfillers = [buildAddress(0), buildAddress(1), buildAddress(2)]

            describe('fulfillBounty', async () => {
                it('should create a fulfillment', async () => {
                    provider.injectValidation(
                        payload => {
                            expect(payload.method).toEqual('eth_sendTransaction')
                            expect(payload.params).toEqual([{
                                data: bountyContract.fulfillBounty(
                                    fulfillers,
                                    IPFS_HASH
                                ).encodeABI(),
                                ...TX_OPTIONS
                            }])
                        },
                        {
                            gasPrice: GAS_PRICE,
                            txHash: TX_HASH
                        }
                    )

                    await expect(bounties.fulfillments.create(
                        BOUNTY_ADDRESS,
                        fulfillers,
                        IPFS_HASH
                    )).resolves.toBe(TX_HASH)
                })
            })

            describe('fulfillAndAccept', () => {
                it.skip('should create & accept a fulfillment', async () => {
                    provider.injectValidation(
                        payload => {
                            expect(payload.method).toEqual('eth_sendTransaction')
                            expect(payload.params).toEqual([{
                                data: bountyContract.fulfillBounty(
                                    fulfillers,
                                    IPFS_HASH
                                ).encodeABI(),
                                ...TX_OPTIONS
                            }])
                        },
                        {
                            gasPrice: GAS_PRICE,
                            txHash: TX_HASH
                        }
                    )

                    await expect(bounties.fulfillments.create(
                        BOUNTY_ADDRESS,
                        fulfillers,
                        IPFS_HASH
                    )).resolves.toBe(TX_HASH)
                })
            })
        })
    })
    */
})