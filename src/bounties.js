import Web3 from 'web3'
import interfaces from './interfaces.json'

class Bounties {
    constructor(web3, contractAddress) {
        if (!(web3 instanceof Web3)) {
            web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io'))
        }

        this._web3 = web3
        this._contractAddress = contractAddress
        this._endpoint = 'https://api.bounties.network'

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
        return new this._web3.eth.Contract(interfaces.StandardBounties, this._contractAddress).methods
    }
}
  
  export default Bounties