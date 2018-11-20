import bounty from './resources/Bounty'

class Bounties {
    constructor(web3, standardBountiesAddress) {
        this._web3 = web3
        this._standardBountiesAddress = standardBountiesAddress
        this._endpoint = 'https://api.bounties.network'

        this.resources = {
            bounty
        }

        for (let key in this.resources) {
            this[key] = this.resources[key]
        }

    }

    get endpoint() {
      return this._endpoint
    }
  
    set endpoint(newEndpoint) {
      this._endpoint = newEndpoint
    }
  
    get standardBountiesAddress() {
      return this._standardBountiesAddress
    }
  
    set standardBountiesAddress(address) {
      this._standardBountiesAddress = address
    }
}
  
  export default Bounties