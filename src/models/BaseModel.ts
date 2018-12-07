import Bounties from '../bounties'
import { Request } from '../utils/request'
import { StandardBounty } from '../contracts/types/StandardBounty';

export abstract class BaseModel {
    bounties: Bounties
    request: Request
    client: StandardBounty

    abstract isLoaded: boolean

    constructor(bounties: Bounties, bountyAddress: string) {
        this.bounties = bounties
        this.request = bounties.request
        this.client = bounties.bountyClient(bountyAddress)

        return new Proxy(this, { get: (target: any, name) => target[name] })
    }

    abstract load(): void
}