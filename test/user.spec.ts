import Web3 from 'web3'
import HDWalletProvider from 'truffle-hdwallet-provider'
import BigNumber from 'bignumber.js';
import { map } from 'lodash';

import { bounties, bountyContract } from './utils/instances'
import { FakeHttpProvider } from './utils/fakeHttpProvider'
import { constants } from './utils/constants'
import { buildAddress, encodeParameters, sanitize } from './utils/helpers'


const {
    USER_ADDRESS,
    FACTORY_ADDRESS,
    BOUNTY_ADDRESS,
    GAS,
    GAS_PRICE,
    TX_HASH,
    IPFS_HASH,
    TX_OPTIONS,
    BOUNTY_DATA,
    USER_FIELDS_TO_SANITIZE,
    STAT_FIELDS_TO_SANITIZE
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
                const user = bounties.user.retrieve(USER_ADDRESS)
                await expect(user).resolves.toEqual(expect.anything())
                const sanitized = sanitize(
                    await user,
                    [...USER_FIELDS_TO_SANITIZE, ...STAT_FIELDS_TO_SANITIZE]
                )
                expect(sanitized).toMatchSnapshot()
            })

            it('should not return user when the address does not exist', async () => {
                const user = await bounties.user.retrieve('1234')
                // TODO: promise should reject if no user is found
                // https://github.com/Bounties-Network/BountiesAPI/issues/252
                expect(user).toMatchSnapshot()
            })
        })

        describe('nonce', () => {
            it('should fetch user\'s nonce', async () => {
                const nonce = bounties.user._nonce(USER_ADDRESS)
                await expect(nonce).resolves.toEqual(expect.anything())
                const sanitized = sanitize(await nonce, ['nonce'])
                expect(sanitized).toMatchSnapshot()
            })
        })

        describe('login', () => {
            it('should log a user in', async () => {
                const user = bounties.user.login()
                await expect(user).resolves.toEqual(expect.anything())
                const sanitized = sanitize(
                    await user,
                    [...USER_FIELDS_TO_SANITIZE, 'hasSignedUp']
                )
                expect(sanitized).toMatchSnapshot()
            })
        })

        describe('logout', () => {
            it('should logout a user', async () => {
                const response = bounties.user.logout()
                await expect(response).resolves.toMatchSnapshot()
            })
        })
    })
})