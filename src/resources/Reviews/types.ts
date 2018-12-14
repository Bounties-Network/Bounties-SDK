import { DjangoListResponse } from '../../utils/types'
import { User } from '../User/types'

export enum ReviewRole {
    reviewee = 'reviewee',
    reviewer = 'reviewer',
}

export interface Review {
    id: number,
    reviewer: User,
    reviewee: User,
    created: string,
    modified: string,
    rating: number,
    review: string,
    platform: string,
}

export type ReviewsResponse = DjangoListResponse<Review>