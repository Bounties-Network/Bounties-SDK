import { bounties, nock } from './utils/instances'
import { LeaderboardMocks } from './__fixtures__/leaderboard'

describe('leaderboard resource', () => {
    describe('offchain', () => {
        describe('issuers leaderboard', () => {
            it('should get issuer leaders', async () => {
                nock.get('/leaderboard/issuer/').reply(200, LeaderboardMocks.leaderboard)
                const leaders = bounties.leaderboard.issuers.list()
                await expect(leaders).resolves.toEqual(LeaderboardMocks.leaderboard)
            })

            it('should should allow limit parameter', async () => {
                nock.get('/leaderboard/issuer/?limit=2').reply(200, LeaderboardMocks.leaderboard)
                const leaders = bounties.leaderboard.issuers.list({ limit: 2 })
                await expect(leaders).resolves.toEqual(LeaderboardMocks.leaderboard)
            })
        })

        describe('fulfillers leaderboard', () => {
            it('should get fulfiller leaders', async () => {
                nock.get('/leaderboard/fulfiller/').reply(200, LeaderboardMocks.leaderboard)
                const leaders = bounties.leaderboard.fulfillers.list()
                await expect(leaders).resolves.toEqual(LeaderboardMocks.leaderboard)
            })

            it('should should allow limit parameter', async () => {
                nock.get('/leaderboard/fulfiller/?limit=2').reply(200, LeaderboardMocks.leaderboard)
                const leaders = bounties.leaderboard.fulfillers.list({ limit: 2 })
                await expect(leaders).resolves.toEqual(LeaderboardMocks.leaderboard)
            })
        })
    })
})