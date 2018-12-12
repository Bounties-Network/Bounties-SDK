import BigNumber from "bignumber.js";


export interface HttpMethod {
    method: string,
    headers?: { [s: string]: string },
    withCredentials: boolean
}

export interface DjangoListResponse<T> {
    count: number,
    results: T[]
}

export interface PlatformQueryParams {
    platform?: string
}

export interface DjangoListQueryParams extends PlatformQueryParams {
    limit?: number
    offset?: number
}

export interface Metadata {
    platform: string
    schemaVersion: number
    schemaName: string
}

export enum Difficulty {
    beginner = 'Beginner',
    intermediate = 'Intermediate',
    advanced = 'Advanced'
}

export interface BountyData {
    title: string,
    body: string,
    categories: string[],
    expectedNumberOfRevisions: number,
    hasPrivateFulfillments: boolean,
    difficulty: Difficulty,
    attachments: {
        ipfsHash?: string,
        ipfsFileName?: string,
        url?: string,
    },
    metadata: Metadata
}

export interface MutableBountyData {
    data?: BountyData,
    approvers?: string[],
    controller?: string,
    deadline?: BigNumber
}