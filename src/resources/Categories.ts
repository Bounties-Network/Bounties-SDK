import { BaseResource } from './base'
import { Request } from '../utils/request'
// import { calculateDecimals } from '../utils/helpers'
import { map, size, isArray } from 'lodash'
import { BigNumber } from 'bignumber.js'
import Bounties from '../bounties';
import { rejects } from 'assert';
import { MutableBountyData, BountyData } from '../utils/types';
import { AxiosPromise } from 'axios';


export class Categories extends BaseResource {
    constructor(bounties: Bounties) {
        super(bounties)
    }

    list(params?: object) {
        return this.request.get('category/', params)
    }
}