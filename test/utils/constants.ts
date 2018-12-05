import { buildAddress, buildTxHash } from './helpers'
import { Difficulty } from '../../src/types';


const USER_ADDRESS = buildAddress(100)
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
}