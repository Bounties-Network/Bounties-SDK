import BigNumber from "bignumber.js";

interface Metadata {
    platform: string
    schemaVersion: number
    schemaName: string
}

interface HttpMethod {
    method: string,
    headers?: { [s: string]: string },
    withCredentials: boolean
}

declare enum Difficulty {
    beginner = 'Beginner',
    intermediate = 'Intermediate',
    advanced = 'Advanced'
}

interface BountyData {
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

interface MutableBountyData {
    data?: BountyData,
    approvers?: string[],
    controller?: string,
    deadline?: BigNumber
}