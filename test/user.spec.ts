import Web3 from 'web3'
import HDWalletProvider from 'truffle-hdwallet-provider'
import BigNumber from 'bignumber.js';
import { map } from 'lodash';

import { bounties, bountyContract, nock } from './utils/instances'
import { FakeHttpProvider } from './utils/fakeHttpProvider'
import { constants } from './utils/constants'
import { buildAddress, encodeParameters, injectSignatureResponse } from './utils/helpers'

import { UserMocks } from './__fixtures__/user'

const {
    API_URL,
    USER_ADDRESS,
    FACTORY_ADDRESS,
    BOUNTY_ADDRESS,
    GAS,
    GAS_PRICE,
    TX_HASH,
    IPFS_HASH,
    TX_OPTIONS,
    BOUNTY_DATA,
    LOGIN_SIGNATURE
} = constants



describe('user resource', () => {
    beforeAll(() => {
        const mnemonic = 'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'
        const provider = new HDWalletProvider(mnemonic, "https://rinkeby.infura.io")
        bounties._web3.setProvider(provider)
    })

    describe('offchain', () => {
        describe('retrieve', () => {
            it('should retrieve user', async () => {
                nock.get(`/user/${USER_ADDRESS}/profile/`).reply(200, UserMocks.user)
                const user = bounties.user.retrieve(USER_ADDRESS)
                await expect(user).resolves.toEqual(UserMocks.user)
            })

            it('should not return user when the address does not exist', async () => {
                nock.get(`/user/${1234}/profile/`).reply(404)
                const user = bounties.user.retrieve('1234')
                expect(user).rejects.toEqual(expect.anything())
            })
        })

        describe('nonce', () => {
            it('should fetch user\'s nonce', async () => {
                nock.get(`/auth/${USER_ADDRESS}/nonce/`).reply(200, UserMocks.nonce)
                const nonce = bounties.user._nonce(USER_ADDRESS)
                await expect(nonce).resolves.toEqual(UserMocks.nonce)
            })
        })

        describe('login', () => {
            it('should log a user in', async () => {
                const provider = new FakeHttpProvider()
                bounties._web3.setProvider(provider)

                provider.injectResult([USER_ADDRESS])
                provider.injectValidation(payload => {
                    expect(payload.method).toEqual('eth_accounts')
                })

                injectSignatureResponse(provider)

                nock.get(`/auth/${USER_ADDRESS}/nonce/`).reply(200, UserMocks.nonce)
                nock.post(
                    '/auth/login/',
                    {
                        public_address: USER_ADDRESS,
                        signature: LOGIN_SIGNATURE
                    }
                ).reply(200, UserMocks.user)

                const user = bounties.user.login()
                await expect(user).resolves.toEqual({
                    user: UserMocks.user,
                    hasSignedUp: UserMocks.nonce.has_signed_up
                })
            })
        })

        describe('logout', () => {
            it('should logout a user', async () => {
                nock.get('/auth/logout/').reply(200, 'Success')
                const response = bounties.user.logout()
                await expect(response).resolves.toEqual('Success')
            })
        })
    })
})