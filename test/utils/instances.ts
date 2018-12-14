import Nock from 'nock'
import Web3 from 'web3'
import ipfsMini from 'ipfs-mini'

import Bounties from '../../src/bounties'
import { constants } from './constants'


const {
    FACTORY_ADDRESS,
    BOUNTY_ADDRESS,
    BOUNTY_METADATA
} = constants

// web3
export const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io'))

// mock ipfs
ipfsMini.prototype.addJSON = (data: object, callback: Function ) => callback(null, 'QmP8QJoTxvxnFm3WSsdG3SdVDSvktJkcmrQ7PmY3Q2D7RX')
export const ipfs = new ipfsMini({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

Nock.disableNetConnect()
export const nock = Nock('https://api.bounties.network')//.log(console.log)

export const bounties = new Bounties(web3, ipfs, FACTORY_ADDRESS, BOUNTY_METADATA)
export const bountyContract = bounties.bountyClient(BOUNTY_ADDRESS).methods
