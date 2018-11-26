import Web3 from 'web3'
import ipfsMini from 'ipfs-mini';
import { addJSON, addBuffer } from './utils/helpers'
import interfaces from './interfaces.json'

class Bounties {
    constructor(web3, ipfs, contractAddress, meta) {
        if (!(web3 instanceof Web3)) {
            web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io'))
        }

        if (!(ipfs instanceof ipfsMini)) {
            ipfs = new ipfsMini({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
        }

        this._web3 = web3
        this._ipfs = { addJSON: addJSON(ipfs.addJSON), addBuffer: addBuffer(ipfs.add), ipfs }
        this._contractAddress = contractAddress
        this._endpoint = 'https://api.bounties.network'
        this._meta = meta || {
            platform: 'bounties-network"',
            schemaVersion: '0.2',
            schemaName: 'standardSchema'
        }

        this.resources = {
            request: require('./utils/request'),
            bounty: require('./resources/Bounty')
        }

        for (let key in this.resources) {
            this[key] = new this.resources[key].default(this)
        }
    }

    set contractAddress(address) {
      this._contractAddress = address
    }

    get contract() {
        return new this._web3.eth.Contract(interfaces.StandardBounties, this._contractAddress)
    }

    tokenClient(address) {
        return new this._web3.eth.Contract(interfaces.Token, address)
    }
}
  
  export default Bounties