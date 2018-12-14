import { bounties, nock } from './utils/instances'
import { constants } from './utils/constants'
import { ReviewsMocks } from './__fixtures__/reviews'

const { USER_ADDRESS, BOUNTY_ADDRESS } = constants

describe('reviews resource', () => {
    describe('retrieve', () => {
        it('should retrieve review by id', async () => {
            nock.get('/reviews/123/').reply(200, ReviewsMocks.review)
            const review = bounties.reviews.retrieve(123)
            await expect(review).resolves.toEqual(ReviewsMocks.review)
        })
    })

    describe('list', () => {
        describe('list', () => {
            it('should list reviews', async () => {
                nock.get('/reviews/').reply(200, ReviewsMocks.reviews)
                const reviews = bounties.reviews.list()
                await expect(reviews).resolves.toEqual(ReviewsMocks.reviews)
            })

            it('should should allow limit parameter', async () => {
                nock.get(`/reviews/?limit=2`).reply(200, ReviewsMocks.reviews)
                const reviews = bounties.reviews.list({ limit: 2 })
                await expect(reviews).resolves.toEqual(ReviewsMocks.reviews)
            })
        })

        describe('for', () => {
            it('should get reviews left for a user', async () => {
                nock.get(`/reviews/?reviewee__public_address=${USER_ADDRESS}`).reply(200, ReviewsMocks.reviews)
                const reviews = bounties.reviews.for(USER_ADDRESS)
                await expect(reviews).resolves.toEqual(ReviewsMocks.reviews)
            })

            it('should should allow limit parameter', async () => {
                nock.get(`/reviews/?reviewee__public_address=${USER_ADDRESS}&limit=2`).reply(200, ReviewsMocks.reviews)
                const reviews = bounties.reviews.for(USER_ADDRESS, { limit: 2 })
                await expect(reviews).resolves.toEqual(ReviewsMocks.reviews)
            })
        })

        describe('by', () => {
            it('should get reviews written by a user', async () => {
                nock.get(`/reviews/?reviewer__public_address=${USER_ADDRESS}`).reply(200, ReviewsMocks.reviews)
                const reviews = bounties.reviews.by(USER_ADDRESS)
                await expect(reviews).resolves.toEqual(ReviewsMocks.reviews)
            })

            it('should should allow limit parameter', async () => {
                nock.get(`/reviews/?reviewer__public_address=${USER_ADDRESS}&limit=2`).reply(200, ReviewsMocks.reviews)
                const reviews = bounties.reviews.by(USER_ADDRESS, { limit: 2 })
                await expect(reviews).resolves.toEqual(ReviewsMocks.reviews)
            })
        })
    })

    describe('create', () => {
        it('should create review', async () => {
            nock.post(`/bounty/${BOUNTY_ADDRESS}/fulfillment/0/review/`).reply(200, ReviewsMocks.review)
            const review = bounties.reviews.create(BOUNTY_ADDRESS, 0, 5, 'Very very good!')
            await expect(review).resolves.toEqual(ReviewsMocks.review)
        })
    })

})