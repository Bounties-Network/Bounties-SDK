import Nock from 'nock'
import ipfsMini from 'ipfs-mini'

import FakeHttpProvider from './helpers/fakeHttpProvider'
import fixtures from './fixtures'
import Bounties from '../src/bounties'


// mock ipfs
ipfsMini.prototype.addJSON = (data, callback) => callback(null, fixtures.rawBountyPayload.ipfsHash)
const ipfs = new ipfsMini({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

// mock http
Nock.disableNetConnect()
const nock = Nock('https://api.bounties.network/')

const bounties = new Bounties(null, ipfs, '0x2af47a65da8CD66729b4209C22017d6A5C2d2400')

describe('bounty module', () => {
    describe('load', () => {
        it('should load bounty with specified id', async () => {
            nock.get('/bounty/1/').reply(200, fixtures.bounty)
    
            const bounty = await bounties.bounty.load((1))
            expect(bounty).toEqual(fixtures.bounty)
        })
    
        it('should load bounty with corrent parameters', async () => {
            const params = { platform__in: 'bounties' }
            nock.get('/bounty/1/').query(params).reply(200, fixtures.bounty)
    
            const bounty = await bounties.bounty.load(1, params)
            expect(bounty).toEqual(fixtures.bounty)
        })
    
        it('should fail if id does not exist', async () => {
            nock.get('/bounty/1234/').reply(400, fixtures.bounty);
            await expect(bounties.bounty.load(1)).rejects.toThrow(new Error())
        })
    })
    
    describe('create', () => {
        it('should generate correct payload', () => {
            const mockedDate = new Date(1998, 9, 29)
            global.Date = jest.fn(() => mockedDate)
            
            const payload = bounties.bounty.generatePayload(fixtures.rawBountyPayload)
            expect(payload).toEqual(fixtures.bountyPayload)
        })

        it('should create bounty that pays out in ether', async () => {
            const provider = new FakeHttpProvider()
            bounties._web3.setProvider(provider)

            provider.injectValidation(function (payload) {
                expect(payload.method).toEqual('eth_sendTransaction')
                expect(payload.params).toEqual([{
                    data: '0x7e9e511d000000000000000000000000e23f91725c6c18204743592f963688b8b8dc2ced000000000000000000000000000000000000000000000000000000005bfadcf000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000008ac7230489e80000000000000000000000000000000000000000000000000000000000000000dead000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008ac7230489e80000000000000000000000000000000000000000000000000000000000000000002e516d5038514a6f547876786e466d335753736447335364564453766b744a6b636d725137506d5933513244375258000000000000000000000000000000000000' ,
                    from: '0xe23f91725c6c18204743592f963688b8b8dc2ced',
                    to: '0x2af47a65da8cd66729b4209c22017d6a5c2d2400',
                    gas: '0x9c40',
                    gasPrice: '0x5',
                    value: '0x8ac7230489e80000'
                }])
            })

            const txHash = '0x5550000000000000000000000000000000000000000000000000000000000001'
            provider.injectResult(txHash)

            provider.injectValidation(function (payload) {
                expect(payload.method).toEqual('eth_getTransactionReceipt')
                expect(payload.params).toEqual([txHash])
            })

            await expect(bounties.bounty.create(fixtures.rawBountyPayload, 5)).resolves.toBe(txHash)
        })

        it('should create bounty that pays out in tokens', async () => {
            const provider = new FakeHttpProvider()
            bounties._web3.setProvider(provider)

            provider.injectValidation(function (payload) {
                expect(payload.method).toEqual('eth_sendTransaction')
                expect(payload.params).toEqual([{
                    data: '0x095ea7b30000000000000000000000002af47a65da8cd66729b4209c22017d6a5c2d24000000000000000000000000000000000000000000000000008ac7230489e80000',
                    from: '0xe23f91725c6c18204743592f963688b8b8dc2ced',
                    to: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
                    gasPrice: '0x5',
                    gas: "0x9c40"
                }])
            })

            provider.injectResult('0x5550000000000000000000000000000000000000000000000000000000000001')
            provider.injectValidation(function (payload) {
                expect(payload.method).toEqual('eth_getTransactionReceipt')
                expect(payload.params).toEqual(['0x5550000000000000000000000000000000000000000000000000000000000001'])
            })

            provider.injectValidation(function (payload) {
                expect(payload.method).toEqual('eth_sendTransaction')
                expect(payload.params).toEqual([{
                    data: '0x7e9e511d000000000000000000000000e23f91725c6c18204743592f963688b8b8dc2ced000000000000000000000000000000000000000000000000000000005bfadcf000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000008ac7230489e80000000000000000000000000000000000000000000000000000000000000000dead0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000b8c77482e45f1f44de1745f52c74426c631bdd520000000000000000000000000000000000000000000000008ac7230489e80000000000000000000000000000000000000000000000000000000000000000002e516d5038514a6f547876786e466d335753736447335364564453766b744a6b636d725137506d5933513244375258000000000000000000000000000000000000',
                    from: '0xe23f91725c6c18204743592f963688b8b8dc2ced',
                    to: '0x2af47a65da8cd66729b4209c22017d6a5c2d2400',
                    gas: '0x9c40',
                    gasPrice: '0x5',
                    value: '0x0'
                }])
            })

            provider.injectResult(null)            

            const txHash = '0x5550000000000000000000000000000000000000000000000000000000000002'
            provider.injectResult(txHash)
            provider.injectValidation(function (payload) {
                expect(payload.method).toEqual('eth_getTransactionReceipt')
                expect(payload.params).toEqual([txHash])
            })

            await expect(bounties.bounty.create(fixtures.rawBountyPayloadPaysTokens, 5)).resolves.toBe(txHash) 
        })
    })

    describe('kill', () => {
        it('should kill a bounty', async () => {
            const provider = new FakeHttpProvider()
            bounties._web3.setProvider(provider)

            provider.injectValidation(function (payload) {
                expect(payload.method).toEqual('eth_sendTransaction')
                expect(payload.params).toEqual([{
                    data: '0x16b57509000000000000000000000000000000000000000000000000000000000000007b',
                    from: '0xe23f91725c6c18204743592f963688b8b8dc2ced',
                    to: '0x2af47a65da8cd66729b4209c22017d6a5c2d2400',
                    gas: '0x9c40',
                    gasPrice: '0x5'
                }])
            })

            const txHash = '0x5550000000000000000000000000000000000000000000000000000000000002'
            provider.injectResult(txHash)
            provider.injectValidation(function (payload) {
                expect(payload.method).toEqual('eth_getTransactionReceipt')
                expect(payload.params).toEqual([txHash])
            })

            await expect(bounties.bounty.kill(123, '0xe23f91725c6c18204743592f963688b8b8dc2ced', 5)).resolves.toBe(txHash)
        })
    })
})