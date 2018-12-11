import Bounties from '../bounties'
import { Request } from '../utils/request'
import Web3 from 'web3'



export abstract class BaseResource {
    bounties: Bounties
    request: Request
    web3: Web3

    constructor(bounties: Bounties) {
        this.bounties = bounties
        this.request = bounties.request
        this.web3 = bounties._web3
    }
}