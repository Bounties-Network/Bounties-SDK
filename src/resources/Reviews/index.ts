import { isString } from 'lodash'

import { BaseResource } from '../base'
import Bounties from '../../bounties'
import { DjangoListQueryParams } from '../../utils/types'
import { ReviewsResponse, ReviewRole, Review } from './types'

export class ReviewsResource extends BaseResource {
    for: (address: string, params?: DjangoListQueryParams) => Promise<ReviewsResponse>
    by:  (address: string, params?: DjangoListQueryParams) => Promise<ReviewsResponse>

    constructor(bounties: Bounties) {
        super(bounties)

        this.for =  this._for.bind(this)
        this.by = this._by.bind(this)
    }

    retrieve(id: number, params?: object): Promise<Review> {
        return this.request.get(`reviews/${id}/`, params)
    }

    list(params?: DjangoListQueryParams): Promise<ReviewsResponse>
    list(address?: string, params?: DjangoListQueryParams): Promise<ReviewsResponse>
    list(address: string, role: ReviewRole, params?: DjangoListQueryParams): Promise<ReviewsResponse>

    list(
        addressOrParams?: string | DjangoListQueryParams,
        roleOrParams?: string | DjangoListQueryParams,
        params?: DjangoListQueryParams
    ) {
        if (isString(addressOrParams)) {
            const address = addressOrParams

            if (isString(roleOrParams)) {
                const role = roleOrParams
                return this.request.get(`reviews/?${role}__public_address=${address}`, params)
            } else {
                return this.request.get(`reviews/?reviewer__public_address=${address}&reviewee__public_address=${address}`, params)
            }
        }

        return this.request.get(`reviews/`, addressOrParams)
    }

    create(bountyAddress: string, fulfillmentId: number, rating: (1|2|3|4|5), review: string) {
        return this.request.post(
            `bounty/${bountyAddress}/fulfillment/${fulfillmentId}/review/`,
            {
                rating,
                review,
                platform: this.bounties._metadata.platform
            }
        )
    }

    _for(address: string, params?: DjangoListQueryParams) {
        return this.list(address, ReviewRole.reviewee, params)
    }

    _by(address: string, params?: DjangoListQueryParams) {
        return this.list(address, ReviewRole.reviewer, params)
    }
}