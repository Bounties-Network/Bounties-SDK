import { BaseResource } from '../base'
import Bounties from '../../bounties';
import { getCurrentAddress } from '../../utils/helpers'
import { PlatformQueryParams } from '../../utils/types'
import { User, LoginResponse } from './types'
import { Log } from 'web3/types';

export class UserResource extends BaseResource {
    constructor(bounties: Bounties) {
        super(bounties)
    }

    retrieve(address: string, params?: PlatformQueryParams): Promise<User> {
        return this.request.get(`user/${address}/profile/`, params)
    }

    async login(): Promise<LoginResponse> {
        return new Promise(async (resolve: (result: LoginResponse) => void , reject) => {
            try {
                const currentAddress = await getCurrentAddress(this.web3)

                const {
                    signature,
                    hasSignedUp
                } = await this._calculateLoginSignature(currentAddress)

                const user: User = await this.request.post(
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

    logout(): Promise<string> {
        return this.request.get('auth/logout/')
    }

    _nonce(address: string): Promise<{ nonce: string, has_signed_up: boolean }> {
        return this.request.get(`auth/${address}/nonce/`)
    }

    async _calculateLoginSignature(address: string): Promise<{ signature: string, hasSignedUp: boolean }> {
        const {
            has_signed_up: hasSignedUp,
            nonce,
        } = await this._nonce(address)

        const message = this.web3.utils.fromUtf8('Hi there! Your special nonce: ' + nonce)
        const signature = await this.web3.eth.sign(message, address)

        return { signature, hasSignedUp }
    }
}