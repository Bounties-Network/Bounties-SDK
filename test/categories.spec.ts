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

describe('categories resource', () => {
    describe('offchain', () => {
        describe('list', () => {
            it('should list categories', async () => {
                const categories = bounties.categories.list()
                await expect(categories).resolves.toEqual(expect.anything())
            })

            it('should allow limit parameter', async () => {
                const categories = bounties.categories.list({ limit: 2 })
                await expect(categories).resolves.toEqual(expect.anything())
                expect((await categories).results).toHaveLength(2)
            })
        })
    })
})