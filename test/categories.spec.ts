import { bounties } from './utils/instances'

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