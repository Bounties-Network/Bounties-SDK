export const rawBountyPayload = {
    // issuer
    issuerAddress: '0xE23F91725c6c18204743592F963688B8B8DC2ceD',
    issuerEmail: 'matt@bounties.network',
    issuerName: 'Matt Garnett',

    // metadata
    title: 'Just another bounty',
    description: 'The description of a beautiful bounty',
    categories: ['javascript', 'honey'],
    revisions: 12,
    deadline: 1543167216,
    hasPrivateFulfillments: false,
    experienceLevel: 'Beginner',
    uid: null,

    // attachments
    ipfsHash: 'QmP8QJoTxvxnFm3WSsdG3SdVDSvktJkcmrQ7PmY3Q2D7RX',
    ipfsFileName: 'Ethereum%20magicians.zip',
    url: 'https://twitter.com/TheCryptoDog/status/1060233070677254144',

    // payment   
    paysTokens: false,
    tokenContract: 0x0,
    tokenSymbol: 'ETH',
    balance: 10 * 10**18,
    fulfillmentAmount: 10 * 10**18,
}

export const rawBountyPayloadPaysTokens = {
    // issuer
    issuerAddress: '0xE23F91725c6c18204743592F963688B8B8DC2ceD',
    issuerEmail: 'matt@bounties.network',
    issuerName: 'Matt Garnett',

    // metadata
    title: 'Just another bounty',
    description: 'The description of a beautiful bounty',
    categories: ['javascript', 'honey'],
    revisions: 12,
    deadline: 1543167216,
    hasPrivateFulfillments: false,
    experienceLevel: 'Beginner',
    uid: null,

    // attachments
    ipfsHash: 'QmP8QJoTxvxnFm3WSsdG3SdVDSvktJkcmrQ7PmY3Q2D7RX',
    ipfsFileName: 'Ethereum%20magicians.zip',
    url: 'https://twitter.com/TheCryptoDog/status/1060233070677254144',

    // payment   
    paysTokens: true,
    tokenContract: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    tokenSymbol: 'TOKEN',
    balance: 10 * 10**18,
    fulfillmentAmount: 10 * 10**18,
}

export const bountyPayload = {
    // issuer
    issuer: {
        address: rawBountyPayload.issuerAddress,
        email: rawBountyPayload.issuerEmail,
        name: rawBountyPayload.issuerName
    },

    funders: [{
        address: rawBountyPayload.issuerAddress,
        email: rawBountyPayload.issuerEmail,
        name: rawBountyPayload.issuerName
    }],

    // metadata
    title: rawBountyPayload.title,
    description: rawBountyPayload.description,
    categories: rawBountyPayload.categories,
    revisions: rawBountyPayload.revisions,
    hasPrivateFulfillments: rawBountyPayload.hasPrivateFulfillments,
    experienceLevel: rawBountyPayload.experienceLevel,
    deadline: rawBountyPayload.deadline.toString(10),
    created: parseInt(new Date(1998, 9, 29).getTime() / 1000) | 0,
    uid: rawBountyPayload.uid,

    // attachments
    ipfsHash: rawBountyPayload.ipfsHash,
    ipfsFileName: rawBountyPayload.ipfsFileName,
    url: rawBountyPayload.url,

    // payment   
    paysTokens: rawBountyPayload.paysTokens,
    tokenContract: rawBountyPayload.tokenContract,
    tokenSymbol: rawBountyPayload.tokenSymbol,
    balance: rawBountyPayload.balance.toString(10),
    fulfillmentAmount: rawBountyPayload.fulfillmentAmount.toString(10),

    meta: {
        platform: 'bounties-network"',
        schemaVersion: '0.2',
        schemaName: 'standardSchema'
    }
}