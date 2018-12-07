import { Request } from '../utils/request'
// import { calculateDecimals } from '../utils/helpers'
import { map, size, isArray } from 'lodash'
import { BigNumber } from 'bignumber.js'
import Bounties from '../bounties';
import { rejects } from 'assert';
import { MutableBountyData, BountyData } from '../types';


export class Fulfillments {
    bounties: Bounties
    request: Request

    constructor(bounties: Bounties) {
        this.bounties = bounties
        this.request = bounties.request
    }

    create(
        bountyAddress: string,
        fulfillers: string[],
        data: string,
        gasPrice?: BigNumber
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const bountyClient = this.bounties.bountyClient(bountyAddress)

                // bountyClient.
            } catch (e) {
                reject(e)
            }
        })
    }
}
