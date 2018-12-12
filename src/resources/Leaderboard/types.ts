import { DjangoListResponse } from '../../utils/types'


export interface Leader {
    address: string,
    name: string,
    email: string,
    githubusername: string,
    profile_image: string,
    total: string,
    total_usd: number,
    bounties_issued: number,
    fulfillments_paid: number
}

export enum LeaderboardSortType {
    issuer = 'issuer',
    fulfiller = 'fulfiller'
}

export type LeaderboardResponse = DjangoListResponse<Leader>