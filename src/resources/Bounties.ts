import { BaseResource } from './base';
import { Request } from '../utils/request'
// import { calculateDecimals } from '../utils/helpers'
import { map, size, isArray } from 'lodash'
import { BigNumber } from 'bignumber.js'
import Bounties from '../bounties';
import { rejects } from 'assert';
import { MutableBountyData, BountyData } from '../utils/types';



export class BountiesClient extends BaseResource {
    constructor(bounties: Bounties) {
        super(bounties)
    }

    load(id: number, params?: object) {
        return this.request.get(`bounty/${id}/`, params)
    }

    create(
        bountyValues: BountyData,
        controller: string,
        approvers: string[],
        deadline: BigNumber,
        payoutTokens: string[],
        tokenVersions: (number | string)[],
        tokenAmounts: BigNumber[],
        gasPrice?: BigNumber
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const bountiesFactory = this.bounties.factory

                const bounties = this.bounties
                const { tokenClient, _ipfs: ipfs } = bounties

                const ipfsHash: string = await ipfs.addJSON(bountyValues)

                /*
                // TODO: batch transactions & add support for 721
                map(payoutTokens, (tokenAddress, index) => {
                    if (tokenAddress == '0x0000000000000000000000000000000000000000') {
                        const tokenContract = tokenClient(tokenAddress)

                        tokenContract.methods.approve(
                            bountyAddress,
                            tokenAmounts[index].toString()
                        )
                        .send({
                            from: (await this.bounties._web3.eth.getAccounts())[0],
                            to: bountyAddress,
                            gas: 40000,
                            gasPrice: gasPrice.toString()
                        })
                        .on('transactionHash', hash => resolve(hash))
                        .on('error', error => reject(error))


                        await approve(bounties.contract.options.address, balance)
                    }
                })
                */

                bountiesFactory.methods.createBounty(
                    controller,
                    approvers,
                    ipfsHash,
                    deadline.toNumber()
                )
                    .send({
                        from: (await this.bounties._web3.eth.getAccounts())[0],
                        to: bountiesFactory._address,
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

    drain(
        bountyAddress: string,
        payoutTokens: string[],
        tokenVersions: BigNumber[],
        tokenAmounts: BigNumber[],
        gasPrice?: BigNumber
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const bountyClient = this.bounties.bountyClient(bountyAddress)

                bountyClient.methods.drainBounty(
                    payoutTokens,
                    map(tokenVersions, version => version.toString()),
                    map(tokenAmounts, amount => amount.toString())
                )
                    .send({
                        from: (await this.bounties._web3.eth.getAccounts())[0],
                        to: bountyClient._address,
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
        bountyAddress: string,
        values: MutableBountyData,
        gasPrice?: BigNumber
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                if (size(values) == 1) {
                    if (values.controller) {
                        return this._changeController(
                            bountyAddress,
                            values.controller,
                            gasPrice
                        )
                            .then(hash => resolve(hash))
                            .catch(e => reject(e))
                    }

                    if (values.data) {
                        const ipfsHash: string = await this.bounties._ipfs.addJSON(values.data)
                        return this._changeData(
                            bountyAddress,
                            ipfsHash,
                            gasPrice
                        )
                            .then(hash => resolve(hash))
                            .catch(e => reject(e))

                    }

                    if (values.deadline) {
                        return this._changeDeadline(
                            bountyAddress,
                            values.deadline,
                            gasPrice
                        )
                            .then(hash => resolve(hash))
                            .catch(e => reject(e))
                    }
                }

                const bountyClient = this.bounties.bountyClient(bountyAddress)
                const from = (await this.bounties._web3.eth.getAccounts())[0]

                const {
                    0: controller,
                    4: approvers,
                    5: deadline,
                } = await bountyClient.methods.getBounty().call()

                let ipfsHash
                if (values.data) {
                    ipfsHash = await this.bounties._ipfs.addJSON(values.data)
                }

                bountyClient.methods.changeBounty(
                    values.controller || controller,
                    values.approvers || approvers,
                    ipfsHash || 'hello',
                    (values.deadline ? values.deadline.toString() : false) || deadline
                )
                    .send({
                        from,
                        to: bountyClient._address,
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
                const bountyClient = this.bounties.bountyClient(bountyAddress)

                bountyClient.methods.changeController(
                    controller
                )
                    .send({
                        from: (await this.bounties._web3.eth.getAccounts())[0],
                        to: bountyClient._address,
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
                const bountyClient = this.bounties.bountyClient(bountyAddress)

                bountyClient.methods.changeApprover(
                    approverId.toString(),
                    newApproverAddress
                )
                    .send({
                        from: (await this.bounties._web3.eth.getAccounts())[0],
                        to: bountyClient._address,
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
                const bountyClient = this.bounties.bountyClient(bountyAddress)

                bountyClient.methods.changeData(
                    data
                )
                    .send({
                        from: (await this.bounties._web3.eth.getAccounts())[0],
                        to: bountyClient._address,
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
                const bountyClient = this.bounties.bountyClient(bountyAddress)

                bountyClient.methods.changeDeadline(
                    deadline.toString()
                )
                    .send({
                        from: (await this.bounties._web3.eth.getAccounts())[0],
                        to: bountyClient._address,
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