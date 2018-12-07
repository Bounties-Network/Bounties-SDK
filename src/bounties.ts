import Web3 from 'web3'
import IPFSMini from 'ipfs-mini';
import { addJSON } from './utils/helpers'
import { interfaces } from './contracts/interfaces'

import { Bounties as BountiesClient } from './clients/Bounties'
import { Request  } from './utils/request'

import { Metadata } from './types'
import { HumanStandardToken } from './contracts/types/HumanStandardToken'
import { StandardBountiesFactory } from './contracts/types/StandardBountiesFactory'
import { StandardBounty } from './contracts/types/StandardBounty'

class Bounties {
    _web3: Web3
    _ipfs: any
    _factoryAddress: string
    _endpoint: string
    _metadata: Metadata

    request: Request
    bounties: BountiesClient


    constructor(web3: Web3, ipfs: any, factoryAddress: string, metadata: Metadata) {
        if (!(web3 instanceof Web3)) {
            web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io'))
        }

        if (!(ipfs instanceof IPFSMini)) {
            ipfs = new IPFSMini({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
        }

        this._web3 = web3
        this._ipfs = { addJSON: addJSON(ipfs.addJSON), ipfs }
        this._factoryAddress = factoryAddress
        this._endpoint = 'https://api.bounties.network'
        this._metadata = metadata

        this.request = new Request(this._endpoint)
        this.bounties = new BountiesClient(this)

        this.tokenClient = this.tokenClient.bind(this)
    }

    set factoryAddress(address: string) {
      this._factoryAddress = address
    }

    get factory() {
        return new this._web3.eth.Contract(interfaces.StandardBountiesFactory, this._factoryAddress) as StandardBountiesFactory
    }

    bountyClient(address: string) {
        return new this._web3.eth.Contract(interfaces.StandardBounty, address) as StandardBounty
    }

    tokenClient(address: string) {
        return new this._web3.eth.Contract(interfaces.HumanStandardToken, address) as HumanStandardToken
    }
}

export default Bounties