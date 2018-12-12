import { BaseResource } from '../base'
import { Request } from '../../utils/request'
// import { calculateDecimals } from '../utils/helpers'
import { map, size, isArray } from 'lodash'
import { BigNumber } from 'bignumber.js'
import Bounties from '../../bounties';
import { rejects } from 'assert';


export class FulfillmentsResource extends BaseResource {
    constructor(bounties: Bounties) {
        super(bounties)
    }

    load(id: number, params?: object) {
        return this.request.get(`bounty/${id}/`, params)
    }

    create(
        bountyAddress: string,
        fulfilers: string[],
        data: string,
        gasPrice?: BigNumber
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const bountyClient = this.bounties.bountyClient(bountyAddress)

                bountyClient.methods.fulfillBounty(
                    fulfilers,
                    data
                )
                    .send({
                        from: (await this.bounties._web3.eth.getAccounts())[0],
                        to: bountyClient._address,
                        gas: 40000,
                        gasPrice: gasPrice ? gasPrice.toString() : undefined
                    })
                    .on('transactionHash', hash => resolve(hash))
                    .on('error', error => reject(error))

            } catch (e) {
                reject(e)
            }
        })
    }

    accept(
        bountyAddress: string,
        fulfillmentId: BigNumber,
        gasPrice?: BigNumber
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const bountyClient = this.bounties.bountyClient(bountyAddress)

                /*
                bountyClient.methods.acceptFulfillment(
                    '0', // figure this out
                    fulfillmentId.toString(),
                )
                    .send({
                        from: (await this.bounties._web3.eth.getAccounts())[0],
                        to: bountyClient._address,
                        gas: 40000,
                        gasPrice: gasPrice ? gasPrice.toString() : undefined
                    })
                    .on('transactionHash', hash => resolve(hash))
                    .on('error', error => reject(error))
                */
            } catch (e) {
                reject(e)
            }
        })
    }

}