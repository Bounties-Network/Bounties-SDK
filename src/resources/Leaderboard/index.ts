import { BaseResource } from '../base'
import Bounties from '../../bounties'
import { DjangoListQueryParams } from '../../utils/types'
import { LeaderboardResponse, LeaderboardSortType } from './types'


export class LeaderboardResource extends BaseResource {
    issuers:    { list: (params?: DjangoListQueryParams) => Promise<LeaderboardResponse> }
    fulfillers: { list: (params?: DjangoListQueryParams) => Promise<LeaderboardResponse> }

    constructor(bounties: Bounties) {
        super(bounties)

        this.issuers    = { list: this._listIssuers.bind(this) }
        this.fulfillers = { list: this._listFulfillers.bind(this) }
    }

    _listIssuers(params?: DjangoListQueryParams) {
        return this._list(LeaderboardSortType.issuer, params)
    }

    _listFulfillers(params?: DjangoListQueryParams) {
        return this._list(LeaderboardSortType.fulfiller, params)
    }

    _list(type: LeaderboardSortType, params?: DjangoListQueryParams) {
        return this.request.get(`leaderboard/${type}/`, params)
    }
}