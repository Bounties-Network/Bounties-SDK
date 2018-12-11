import { BaseResource } from './base'
import Bounties from '../bounties';


export class Leaderboard extends BaseResource {
    issuers: { list: Function }
    fulfillers: { list: Function }

    constructor(bounties: Bounties) {
        super(bounties)

        this.issuers    = { list: this._listIssuers.bind(this) }
        this.fulfillers = { list: this._listFulfillers.bind(this) }
    }

    _listIssuers(params?: object) {
        return this._list('issuer', params)
    }

    _listFulfillers(params?: object) {
        return this._list('fulfiller', params)
    }

    _list(type: string, params?: object) {
        return this.request.get(`leaderboard/${type}`, params)
    }
}