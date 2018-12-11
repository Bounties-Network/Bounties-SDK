import { buildAddress, buildTxHash } from './helpers'
import { Difficulty } from '../../src/utils/types';


const USER_ADDRESS = '0xE23F91725c6c18204743592F963688B8B8DC2ceD'
const FACTORY_ADDRESS = buildAddress(200)
const BOUNTY_ADDRESS = buildAddress(300)
const GAS = '0x9c40'
const GAS_PRICE = '0x5'
const TX_HASH = buildTxHash(0)
const IPFS_HASH = 'QmP8QJoTxvxnFm3WSsdG3SdVDSvktJkcmrQ7PmY3Q2D7RX'
const TX_OPTIONS = {
    from: USER_ADDRESS.toLowerCase(),
    to: BOUNTY_ADDRESS.toLowerCase(),
    gas: GAS,
    gasPrice: GAS_PRICE
}
const BOUNTY_METADATA = {
    platform: 'bounties-network',
    schemaVersion: 0.2,
    schemaName: 'standard'
}
const BOUNTY_DATA = {
    title: 'Bounty Title',
    body: 'Bounty body!!',
    categories: ['javascript', 'research'],
    expectedNumberOfRevisions: 1,
    hasPrivateFulfillments: true,
    difficulty: 'Beginner' as Difficulty,
    attachments: {
        ipfsHash: IPFS_HASH,
        ipfsFileName: 'pic.jpg',
        url: 'https://bounties.network',
    },
    metadata: BOUNTY_METADATA
}

const USER_FIELDS_TO_SANITIZE = [
    'user.categories',
    'user.dribble',
    'user.edited',
    'user.email',
    'user.ens_domain',
    'user.github',
    'user.languages',
    'user.large_profile_image_url',
    'user.last_logged_in',
    'user.last_viewed',
    'user.linkedin',
    'user.name',
    'user.organization',
    'user.page_preview',
    'user.settings',
    'user.skills',
    'user.small_profile_image_url',
    'user.twitter',
    'user.wants_marketing_emails',
    'user.website',
]

const STAT_FIELDS_TO_SANITIZE = [
    'stats.awarded',
    'stats.earned',
    'stats.fulfiller_fulfillment_acceptance',
    'stats.fulfiller_ratings_received',
    'stats.issuer_fulfillment_acceptance',
    'stats.issuer_ratings_given',
    'stats.issuer_ratings_received',
    'stats.total_bounties',
    'stats.total_fulfillments',
    'stats.total_fulfillments_on_bounties',
]

export const constants = {
    USER_ADDRESS,
    FACTORY_ADDRESS,
    BOUNTY_ADDRESS,
    GAS,
    GAS_PRICE,
    TX_HASH,
    IPFS_HASH,
    TX_OPTIONS,
    BOUNTY_DATA,
    BOUNTY_METADATA,
    USER_FIELDS_TO_SANITIZE,
    STAT_FIELDS_TO_SANITIZE
}