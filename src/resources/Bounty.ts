import { Request } from '../utils/request'
// import { calculateDecimals } from '../utils/helpers'
import { map } from 'lodash'
import { BigNumber } from 'bignumber.js'
import Bounties from '../bounties';
import { rejects } from 'assert';


export class BountyClient {
    bounties: Bounties
    request: Request

    constructor(bounties: Bounties) {
        this.bounties = bounties
        this.request = bounties.request
    }

    load(id: number, params?: object) {
        return this.request.get(`bounty/${id}/`, params)
    }

    create(
        bountyValues: BountySchema,
        controller: string,
        approvers: string[],
        deadline: BigNumber,
        payoutTokens: string[],
        tokenVersions: (number | string)[],
        tokenAmounts: BigNumber[],
        gasPrice: BigNumber = new BigNumber(5)
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
                        gasPrice: gasPrice.toString()
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
        gasPrice: BigNumber = new BigNumber(5)
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
                        gasPrice: gasPrice.toString()
                    })
                    .on('transactionHash', hash => resolve(hash))
                    .on('error', error => reject(error))
            } catch (e) {
                reject(e)
            }
        })
    }

    change(
        bountyAddress: string,
        controller: string,
        approvers: string[],
        data: string,
        deadline: BigNumber,
        gasPrice: BigNumber = new BigNumber(5)
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const bountyClient = this.bounties.bountyClient(bountyAddress)
                bountyClient.methods.changeBounty(
                    controller,
                    approvers,
                    data,
                    deadline.toString()
                )
                    .send({
                        from: (await this.bounties._web3.eth.getAccounts())[0],
                        to: bountyClient._address,
                        gas: 40000,
                        gasPrice: gasPrice.toString()
                    })
                    .on('transactionHash', hash => resolve(hash))
                    .on('error', error => reject(error))
            } catch (e) {
                reject(e)
            }
        })
    }

    changeController(
        bountyAddress: string,
        controller: string,
        gasPrice: BigNumber = new BigNumber(5)
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
                        gasPrice: gasPrice.toString()
                    })
                    .on('transactionHash', hash => resolve(hash))
                    .on('error', error => reject(error))
            } catch (e) {
                reject(e)
            }
        })
    }

    changeApprover(
        bountyAddress: string,
        approverId: number,
        newApproverAddress: string,
        gasPrice: BigNumber = new BigNumber(5)
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const bountyClient = this.bounties.bountyClient(bountyAddress)

                bountyClient.methods.changeApprover(
                    approverId,
                    newApproverAddress
                )
                    .send({
                        from: (await this.bounties._web3.eth.getAccounts())[0],
                        to: bountyClient._address,
                        gas: 40000,
                        gasPrice: gasPrice.toString()
                    })
                    .on('transactionHash', hash => resolve(hash))
                    .on('error', error => reject(error))
            } catch (e) {
                reject(e)
            }
        })
    }

    changeData(
        bountyAddress: string,
        data: string,
        gasPrice: BigNumber = new BigNumber(5)
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
                        gasPrice: gasPrice.toString()
                    })
                    .on('transactionHash', hash => resolve(hash))
                    .on('error', error => reject(error))
            } catch (e) {
                reject(e)
            }
        })
    }

    changeDeadline(
        bountyAddress: string,
        deadline: BigNumber,
        gasPrice: BigNumber = new BigNumber(5)
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
                        gasPrice: gasPrice.toString()
                    })
                    .on('transactionHash', hash => resolve(hash))
                    .on('error', error => reject(error))
            } catch (e) {
                reject(e)
            }
        })
    }
}