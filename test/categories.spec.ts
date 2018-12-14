import { bounties, nock } from './utils/instances'
import { CategoriesMocks } from './__fixtures__/categories'

describe('categories resource', () => {
    describe('offchain', () => {
        describe('list', () => {
            it('should list categories', async () => {
                nock.get('/category/').reply(200, CategoriesMocks.categories)
                const categories = bounties.categories.list()
                await expect(categories).resolves.toEqual(CategoriesMocks.categories)
            })

            it('should allow limit parameter', async () => {
                nock.get('/category/?limit=2').reply(200, CategoriesMocks.categories)
                const categories = bounties.categories.list({ limit: 2 })
                await expect(categories).resolves.toEqual(CategoriesMocks.categories)
            })
        })
    })
})