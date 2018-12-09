import Bounties from '../bounties';
import { Request } from '../utils/request'


export abstract class BaseResource {
    bounties: Bounties
    request: Request

    constructor(bounties: Bounties) {
        this.bounties = bounties
        this.request = bounties.request
    }
}