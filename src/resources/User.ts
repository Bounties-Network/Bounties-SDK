import { BaseResource } from './base'
import Bounties from '../bounties';
import { getCurrentAddress } from '../utils/helpers'

export class User extends BaseResource {
    constructor(bounties: Bounties) {
        super(bounties)
    }

    retrieve(address: string, params?: object) {
        return this.request.get(`user/${address}/profile/`, params)
    }

    async login() {
        return new Promise(async (resolve, reject) => {
            try {
                const currentAddress = await getCurrentAddress(this.web3)

                const {
                    signature,
                    hasSignedUp
                } = await this._calculateLoginSignature(currentAddress)

                const user = await this.request.post(
                    'auth/login/',
                    {
                        public_address: currentAddress,
                        signature
                    }
                )

                resolve({ user, hasSignedUp })
            } catch(e) {
                reject(e)
            }
        })
    }

    logout() {
        return this.request.get('auth/logout/')
    }

    _nonce(address: string): Promise<{ nonce: string, has_signed_up: boolean }> {
        return this.request.get(`auth/${address}/nonce/`)
    }

    async _calculateLoginSignature(address: string) {
        const {
            has_signed_up: hasSignedUp,
            nonce,
        } = await this._nonce(address)

        const message = this.web3.utils.fromUtf8('Hi there! Your special nonce: ' + nonce)
        const signature = await this.web3.eth.sign(message, address)

        return { signature, hasSignedUp }
    }
}