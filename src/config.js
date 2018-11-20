class Configuration {
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

export default new Configuration()