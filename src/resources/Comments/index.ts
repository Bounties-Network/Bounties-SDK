import { isString } from 'lodash'

import { BaseResource } from '../base'
import Bounties from '../../bounties'
import { DjangoListQueryParams } from '../../utils/types'
import { CommentsResponse } from './types'

export class CommentsResource extends BaseResource {
    constructor(bounties: Bounties) {
        super(bounties)
    }

    list(bountyAddress: string, params?: DjangoListQueryParams): Promise<CommentsResponse> {
        return this.request.get(`bounty/${bountyAddress}/comment/`, params)
    }

    create(bountyAddress: string, comment: string) {
        return this.request.post(`bounty/${bountyAddress}/comment/`, { text: comment })
    }
}