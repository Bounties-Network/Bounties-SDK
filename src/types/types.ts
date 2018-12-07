import BigNumber from "bignumber.js";

export interface Metadata {
    platform: string
    schemaVersion: number
    schemaName: string
}

export interface HttpMethod {
    method: string,
    headers?: { [s: string]: string },
    withCredentials: boolean
}

export declare enum Difficulty {
    beginner = 'Beginner',
    intermediate = 'Intermediate',
    advanced = 'Advanced'
}

export type Bounty = BountyData & BountyOnChain & BountyRelations

export interface BountyOnChain {
    address: string
    controller: string
    approvers: string[]
    data: string
    deadline: BigNumber
    balance: { [address: string]: { type: BigNumber, amount: BigNumber } }
    payoutAmount: { [address: string]: { type: BigNumber, amount: BigNumber } }
}

export interface BountyRelations {
    fulfillments: any // TODO: implement Fulfillments class
    contributions: any // TODO: implement Contributions class
    comments: any // TODO: implement Comments class
}

export interface BountyData {
    title: string,
    body: string,
    categories: string[],
    expectedNumberOfRevisions: BigNumber,
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