import { bounties, nock } from './utils/instances'
import { constants } from './utils/constants'
import { CommentsMocks } from './__fixtures__/comments'

const { BOUNTY_ADDRESS } = constants

describe('comments resource', () => {
    describe('list', () => {
        it('should list reviews', async () => {
            nock.get(`/bounty/${BOUNTY_ADDRESS}/comment/`).reply(200, CommentsMocks.comments)
            const comments = bounties.comments.list(BOUNTY_ADDRESS)
            await expect(comments).resolves.toEqual(CommentsMocks.comments)
        })

        it('should should allow limit parameter', async () => {
            nock.get(`/bounty/${BOUNTY_ADDRESS}/comment/?limit=2`).reply(200, CommentsMocks.comments)
            const comments = bounties.comments.list(BOUNTY_ADDRESS, { limit: 2 })
            await expect(comments).resolves.toEqual(CommentsMocks.comments)
        })
    })

    describe('create', () => {
        it('should create review', async () => {
            nock.post(
                `/bounty/${BOUNTY_ADDRESS}/comment/`,
                {
                    text: CommentsMocks.comment.text
                }
            ).reply(200, CommentsMocks.comment)

            const comment = bounties.comments.create(BOUNTY_ADDRESS, CommentsMocks.comment.text)
            await expect(comment).resolves.toEqual(CommentsMocks.comment)
        })
    })

})