import nock from 'nock'
import fixtures from './fixtures'
import { load } from '../src/bounty'

nock.disableNetConnect()
const mock = nock('https://api.bounties.network/')

describe('bounty module', () => {
    it('should load bounty with specified id', async () => {
        mock.get('/bounty/1/').reply(200, fixtures.bounty)

        const bounty = await load(1)
        expect(bounty).toEqual(fixtures.bounty)
    })

    it('should load bounty with corrent parameters', async () => {
        const params = { platform__in: 'bounties' }
        mock.get('/bounty/1/').query(params).reply(200, fixtures.bounty)

        const bounty = await load(1, params)
        expect(bounty).toEqual(fixtures.bounty)
    })

    it('should fail if id does not exist', async () => {
        mock.get('/bounty/1234/').reply(400, fixtures.bounty);
        expect(() => await load(1)).toThrow()
    })
})
