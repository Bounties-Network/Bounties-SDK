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

describe('fulfillments resource', () => {
    describe.skip('offchain', () => {
        describe('load', () => {
            it('should load fulfillment with specified id', async () => {

                const bounty = await bounties.bounties.load((1))
            })

            it('should load fulfillment with corrent parameters', async () => {
                const params = { platform__in: 'bounties' }

                const bounty = await bounties.bounties.load(1, params)
            })

            it('should fail to load fulfillment if id does not exist', async () => {
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
    })
})