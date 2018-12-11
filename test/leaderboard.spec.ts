import { bounties } from './utils/instances'

describe('categories resource', () => {
    describe('offchain', () => {
        describe('issuers leaderboard', () => {
            it('should get issuer leaders', async () => {
                const leaders = bounties.leaderboard.issuers.list()
                await expect(leaders).resolves.toEqual(expect.anything())
            })

            it('should should allow limit parameter', async () => {
                const leaders = bounties.leaderboard.issuers.list({ limit: 2 })
                await expect(leaders).resolves.toEqual(expect.anything())
                expect((await leaders).results).toHaveLength(2)
            })
        })

        describe('fulfillers leaderboard', () => {
            it('should get fulfillment leaders', async () => {
                const leaders = bounties.leaderboard.fulfillers.list()
                await expect(leaders).resolves.toEqual(expect.anything())
            })

            it('should should allow limit parameter', async () => {
                const leaders = bounties.leaderboard.fulfillers.list({ limit: 2 })
                await expect(leaders).resolves.toEqual(expect.anything())
                expect((await leaders).results).toHaveLength(2)
            })
        })
    })
})