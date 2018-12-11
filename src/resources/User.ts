import { BaseResource } from './base'
import { Request } from '../utils/request'
// import { calculateDecimals } from '../utils/helpers'
import { map, size, isArray } from 'lodash'
import { BigNumber } from 'bignumber.js'
import Bounties from '../bounties';
import { rejects } from 'assert';
import { MutableBountyData, BountyData } from '../utils/types';
import { AxiosPromise } from 'axios';


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
                const currentAddress = (await this.web3.eth.getAccounts())[0]

                const {
                    has_signed_up: hasSignedUp,
                    nonce,
                } = await this._nonce(currentAddress)

                const message = this.web3.utils.fromUtf8('Hi there! Your special nonce: ' + nonce)
                const signature = await this.web3.eth.sign(message, currentAddress)

                const user = await this.request.post(
                    `auth/login/`,
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

}