import { BaseResource } from './base'
import Bounties from '../bounties';


export class Categories extends BaseResource {
    constructor(bounties: Bounties) {
        super(bounties)
    }

    list(params?: object) {
        return this.request.get('category/', params)
    }
}