import Bounties from './bounties'
import { Request } from './utils/request'

export class Base {
    bounties: Bounties
    request: Request

    constructor(bounties: Bounties) {
        this.bounties = bounties
        this.request = bounties.request
    }
}