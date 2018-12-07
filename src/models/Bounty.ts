import { Base } from '../Base'
import { Request } from '../utils/request'
// import { calculateDecimals } from '../utils/helpers'
import { assign, map, size, isArray, forEach } from 'lodash'
import { BigNumber } from 'bignumber.js'
import Bounties from '../bounties';
import { rejects } from 'assert';
import { Bounty as BountyType, MutableBountyData, BountyData, Metadata, Difficulty } from '../types/types'
import { Fulfillments } from './Fulfillment';
import { StandardBounty } from '../contracts/types/StandardBounty';
import { EMPTY_BOUNTY } from '../utils/constants'


export class Bounty extends Base implements BountyType {
    isLoaded: boolean
    client: StandardBounty

    // stored in contract
    address: string
    controller: string
    approvers: string[]
    data: string
    deadline: BigNumber
    balance: { [address: string]: { type: BigNumber, amount: BigNumber } }
    payoutAmount: { [address: string]: { type: BigNumber, amount: BigNumber } }

    // relations
    fulfillments: any // TODO: implement Fulfillments class
    contributions: any // TODO: implement Contributions class
    comments: any // TODO: implement Comments class

    // ipfs data
    title: string
    body: string
    categories: string[]
    expectedNumberOfRevisions: BigNumber
    hasPrivateFulfillments: boolean
    difficulty: Difficulty
    attachments: {
        ipfsHash?: string,
        ipfsFileName?: string,
        url?: string,
    }
    metadata: Metadata

    constructor(bounties: Bounties, address: string)
    constructor(bounties: Bounties, data: BountyType)
    constructor(bounties: Bounties, addressOrData: string | BountyType) {
        super(bounties)

        let bounty = EMPTY_BOUNTY

        this.isLoaded = false
        this.address = typeof addressOrData == 'string' ? addressOrData : addressOrData.address

        if (typeof addressOrData != 'string') {
            this.isLoaded = true
            assign(bounty, addressOrData)

        }

        this.client = bounties.bountyClient(this.address)
        this.controller = bounty.controller
        this.approvers = bounty.approvers
        this.data = bounty.data
        this.deadline = bounty.deadline
        this.balance = bounty.balance
        this.payoutAmount = bounty.payoutAmount
        this.fulfillments = bounty.fulfillments
        this.contributions = bounty.contributions
        this.comments = bounty.comments
        this.title = bounty.title
        this.body = bounty.body
        this.categories = bounty.categories
        this.expectedNumberOfRevisions = bounty.expectedNumberOfRevisions
        this.hasPrivateFulfillments = bounty.hasPrivateFulfillments
        this.difficulty = bounty.difficulty
        this.attachments = bounty.attachments
        this.metadata = bounty.metadata
    }

    drain(
        payoutTokens: string[],
        tokenVersions: BigNumber[],
        tokenAmounts: BigNumber[],
        gasPrice?: BigNumber
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                this.client.methods.drainBounty(
                    payoutTokens,
                    map(tokenVersions, version => version.toString()),
                    map(tokenAmounts, amount => amount.toString())
                )
                    .send({
                        from: (await this.bounties._web3.eth.getAccounts())[0],
                        to: this.address,
                        gas: 40000,
                        gasPrice: gasPrice ? gasPrice.toString() : undefined
                    })
                    .on('transactionHash', hash => resolve(hash))
                    .on('error', error => reject(error))
            } catch (e) {
                reject(e)
            }
        })
    }

    update(
        values: MutableBountyData,
        gasPrice?: BigNumber
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                if (size(values) == 1) {
                    if (values.controller) {
                        return this._changeController(
                            this.address,
                            values.controller,
                            gasPrice
                        )
                            .then(hash => resolve(hash))
                            .catch(e => reject(e))
                    }

                    if (values.data) {
                        const ipfsHash: string = await this.bounties._ipfs.addJSON(values.data)
                        return this._changeData(
                            this.address,
                            ipfsHash,
                            gasPrice
                        )
                            .then(hash => resolve(hash))
                            .catch(e => reject(e))

                    }

                    if (values.deadline) {
                        return this._changeDeadline(
                            this.address,
                            values.deadline,
                            gasPrice
                        )
                            .then(hash => resolve(hash))
                            .catch(e => reject(e))
                    }
                }

                const from = (await this.bounties._web3.eth.getAccounts())[0]

                const {
                    0: controller,
                    4: approvers,
                    5: deadline,
                } = await this.client.methods.getBounty().call()

                let ipfsHash
                if (values.data) {
                    ipfsHash = await this.bounties._ipfs.addJSON(values.data)
                }

                this.client.methods.changeBounty(
                    values.controller || controller,
                    values.approvers || approvers,
                    ipfsHash || 'hello',
                    (values.deadline ? values.deadline.toString() : false) || deadline
                )
                    .send({
                        from,
                        to: this.address,
                        gas: 40000,
                        gasPrice: gasPrice ? gasPrice.toString() : undefined
                    })
                    .on('transactionHash', hash => resolve(hash))
                    .on('error', error => reject(error))
            } catch (e) {
                reject(e)
            }
        })
    }

    _changeController(
        bountyAddress: string,
        controller: string,
        gasPrice?: BigNumber
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                this.client.methods.changeController(
                    controller
                )
                    .send({
                        from: (await this.bounties._web3.eth.getAccounts())[0],
                        to: this.address,
                        gas: 40000,
                        gasPrice: gasPrice ? gasPrice.toString() : undefined
                    })
                    .on('transactionHash', hash => resolve(hash))
                    .on('error', error => reject(error))
            } catch (e) {
                reject(e)
            }
        })
    }

    _changeApprover(
        bountyAddress: string,
        approverId: BigNumber,
        newApproverAddress: string,
        gasPrice?: BigNumber
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                this.client.methods.changeApprover(
                    approverId.toString(),
                    newApproverAddress
                )
                    .send({
                        from: (await this.bounties._web3.eth.getAccounts())[0],
                        to: this.address,
                        gas: 40000,
                        gasPrice: gasPrice ? gasPrice.toString() : undefined
                    })
                    .on('transactionHash', hash => resolve(hash))
                    .on('error', error => reject(error))
            } catch (e) {
                reject(e)
            }
        })
    }

    _changeData(
        bountyAddress: string,
        data: string,
        gasPrice?: BigNumber
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                this.client.methods.changeData(
                    data
                )
                    .send({
                        from: (await this.bounties._web3.eth.getAccounts())[0],
                        to: this.address,
                        gas: 40000,
                        gasPrice: gasPrice ? gasPrice.toString() : undefined
                    })
                    .on('transactionHash', hash => resolve(hash))
                    .on('error', error => reject(error))
            } catch (e) {
                reject(e)
            }
        })
    }

    _changeDeadline(
        bountyAddress: string,
        deadline: BigNumber,
        gasPrice?: BigNumber
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                this.client.methods.changeDeadline(
                    deadline.toString()
                )
                    .send({
                        from: (await this.bounties._web3.eth.getAccounts())[0],
                        to: this.address,
                        gas: 40000,
                        gasPrice: gasPrice ? gasPrice.toString() : undefined
                    })
                    .on('transactionHash', hash => resolve(hash))
                    .on('error', error => reject(error))
            } catch (e) {
                reject(e)
            }
        })
    }
}