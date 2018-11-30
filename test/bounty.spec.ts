import Nock from 'nock'
import Web3 from 'web3'
import ipfsMini from 'ipfs-mini'

import { FakeHttpProvider } from './helpers/fakeHttpProvider'
import fixtures from './fixtures'
import Bounties from '../src/bounties'
import BigNumber from 'bignumber.js';
import { Provider } from 'web3/providers';

const buildTxHash = (hashId: number) => {
    let hash = '0x7000000000000000000000000000000000000000000000000000000000000000'.slice(
        0, 66 - hashId.toString().length
    )

    return hash + hashId.toString()
}

const buildAddress = (id: number) => {
    let address = '0xADD3255000000000000000000000000000000000'.slice(
        0, 42 - id.toString().length
    )

    return Web3.utils.toChecksumAddress(address + id.toString())
}

const USER_ADDRESS = buildAddress(100)
const FACTORY_ADDRESS = buildAddress(200)
const BOUNTY_ADDRESS = buildAddress(300)
const GAS = '0x9c40'
const GAS_PRICE = '0x5'
const IPFS_HASH = 'QmP8QJoTxvxnFm3WSsdG3SdVDSvktJkcmrQ7PmY3Q2D7RX'


// web3
const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io'))

// mock ipfs
ipfsMini.prototype.addJSON = (data: object, callback: Function ) => callback(null, fixtures.rawBountyPayload.ipfsHash)
const ipfs = new ipfsMini({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

// mock http
Nock.disableNetConnect()
const nock = Nock('https://api.bounties.network/').log(console.log)

const metadata = {
    platform: 'bounties-network',
    schemaVersion: 0.2,
    schemaName: 'standard'
}
const bounties = new Bounties(web3, ipfs, FACTORY_ADDRESS, metadata)

describe('bounty module', () => {
    describe('offchain', () => {
        /*
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
                await expect(bounties.bounty.load(1)).rejects.toThrow(new Error('404'))
            })
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
    */
    })

    describe('onchain', () => {
        let provider: FakeHttpProvider

        beforeEach(() => {
            provider = new FakeHttpProvider()
            bounties._web3.setProvider(provider)

            // inject result for web3.eth.getAccounts() calls & validate the call occured
            provider.injectResult([USER_ADDRESS])
            provider.injectValidation(payload => {
                expect(payload.method).toEqual('eth_accounts')
            })
        })

        describe('drain', () => {
            it('should drain a bounty', async () => {
                provider.injectValidation(payload => {
                    expect(payload.method).toEqual('eth_sendTransaction')
                    expect(payload.params).toEqual([{
                        data: '0x0f95c22c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000002000000000000000000000000add3255000000000000000000000000000000000000000000000000000000000add32550000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001400000000000000000000000000000000000000000000000000000000000000140000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000c8',
                        from: USER_ADDRESS.toLowerCase(),
                        to: BOUNTY_ADDRESS.toLowerCase(),
                        gas: GAS,
                        gasPrice: GAS_PRICE
                    }])
                })
    
                provider.injectResult(buildTxHash(0))
                provider.injectValidation(payload => {
                    expect(payload.method).toEqual('eth_getTransactionReceipt')
                    expect(payload.params).toEqual([buildTxHash(0)])
                })
    
                await expect(bounties.bounty.drain(
                    BOUNTY_ADDRESS, 
                    [buildAddress(0), buildAddress(1)], 
                    [20, 20],
                    [new BigNumber(10), new BigNumber(200)]
                )).resolves.toBe(buildTxHash(0))
            })
        })
    
        describe('change', () => {
            it('should change a bounty', async () => {
                provider.injectValidation(payload => {
                    expect(payload.method).toEqual('eth_sendTransaction')
                    expect(payload.params).toEqual([{
                        data: '0x16793672000000000000000000000000add32550000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000f61370d00000000000000000000000000000000000000000000000000000000000000003000000000000000000000000add3255000000000000000000000000000000000000000000000000000000000add3255000000000000000000000000000000001000000000000000000000000add3255000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002e516d5038514a6f547876786e466d335753736447335364564453766b744a6b636d725137506d5933513244375258000000000000000000000000000000000000',
                        from: USER_ADDRESS.toLowerCase(),
                        to: BOUNTY_ADDRESS.toLowerCase(),
                        gas: GAS,
                        gasPrice: GAS_PRICE
                    }])
                })
    
                provider.injectResult(buildTxHash(0))
                provider.injectValidation(payload => {
                    expect(payload.method).toEqual('eth_getTransactionReceipt')
                })

                await expect(bounties.bounty.change(
                    BOUNTY_ADDRESS,
                    USER_ADDRESS,
                    [buildAddress(0), buildAddress(1), buildAddress(2)],
                    IPFS_HASH,
                    new BigNumber(new Date(2100, 9, 29).getTime() / 1000)
                )).resolves.toBe(buildTxHash(0))
            })
        })

        describe('changeController', async () => {
            it('should change the controller', async () => {
                provider.injectValidation(payload => {
                    expect(payload.method).toEqual('eth_sendTransaction')
                    expect(payload.params).toEqual([{
                        data: '0x3cebb823000000000000000000000000add3255000000000000000000000000000000000',
                        from: USER_ADDRESS.toLowerCase(),
                        to: BOUNTY_ADDRESS.toLowerCase(),
                        gas: GAS,
                        gasPrice: GAS_PRICE
                    }])
                })
    
                provider.injectResult(buildTxHash(0))
                provider.injectValidation(payload => {
                    expect(payload.method).toEqual('eth_getTransactionReceipt')
                })

                await expect(bounties.bounty.changeController(
                    BOUNTY_ADDRESS,
                    buildAddress(0)
                )).resolves.toBe(buildTxHash(0))
            })
        })

        describe('changeApprover', async () => {
            it('should change the approver', async () => {
                provider.injectValidation(payload => {
                    expect(payload.method).toEqual('eth_sendTransaction')
                    expect(payload.params).toEqual([{
                        data: '0xe9be41660000000000000000000000000000000000000000000000000000000000000001000000000000000000000000add3255000000000000000000000000000000000',
                        from: USER_ADDRESS.toLowerCase(),
                        to: BOUNTY_ADDRESS.toLowerCase(),
                        gas: GAS,
                        gasPrice: GAS_PRICE
                    }])
                })
    
                provider.injectResult(buildTxHash(0))
                provider.injectValidation(payload => {
                    expect(payload.method).toEqual('eth_getTransactionReceipt')
                })

                await expect(bounties.bounty.changeApprover(
                    BOUNTY_ADDRESS,
                    1,
                    buildAddress(0)
                )).resolves.toBe(buildTxHash(0))
            })
        })

        describe('changeData', async () => {
            it('should change the data associated with the bounty', async () => {
                provider.injectValidation(payload => {
                    expect(payload.method).toEqual('eth_sendTransaction')
                    expect(payload.params).toEqual([{
                        data: '0x2a0fccd50000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002e516d5038514a6f547876786e466d335753736447335364564453766b744a6b636d725137506d5933513244375258000000000000000000000000000000000000',
                        from: USER_ADDRESS.toLowerCase(),
                        to: BOUNTY_ADDRESS.toLowerCase(),
                        gas: GAS,
                        gasPrice: GAS_PRICE
                    }])
                })
    
                provider.injectResult(buildTxHash(0))
                provider.injectValidation(payload => {
                    expect(payload.method).toEqual('eth_getTransactionReceipt')
                })

                await expect(bounties.bounty.changeData(
                    BOUNTY_ADDRESS,
                    IPFS_HASH
                )).resolves.toBe(buildTxHash(0))
            })
        })

        describe('changeDeadline', async () => {
            it('should change the deadline', async () => {
                provider.injectValidation(payload => {
                    expect(payload.method).toEqual('eth_sendTransaction')
                    expect(payload.params).toEqual([{
                        data: '0x7aca97b500000000000000000000000000000000000000000000000000000000f61370d0',
                        from: USER_ADDRESS.toLowerCase(),
                        to: BOUNTY_ADDRESS.toLowerCase(),
                        gas: GAS,
                        gasPrice: GAS_PRICE
                    }])
                })
    
                provider.injectResult(buildTxHash(0))
                provider.injectValidation(payload => {
                    expect(payload.method).toEqual('eth_getTransactionReceipt')
                })

                await expect(bounties.bounty.changeDeadline(
                    BOUNTY_ADDRESS,
                    new BigNumber(new Date(2100, 9, 29).getTime() / 1000)
                )).resolves.toBe(buildTxHash(0))
            })
        })
        
    })
    
})