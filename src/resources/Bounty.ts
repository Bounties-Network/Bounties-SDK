import { Request } from '../utils/request'
// import { calculateDecimals } from '../utils/helpers'
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

    // create(bounty: Bounty, gasPrice?: number) {
    //     return new Promise(async (resolve, reject) => {
    //         const bounties = this.bounties
    //         const { 
    //             tokenClient, 
    //             _ipfs: ipfs 
    //         } = bounties

    //         try {
    //             const ipfsHash = await ipfs.addJSON(bounty)
        
    //             // if (paysTokens) {
    //             //     const tokenContract = tokenClient(tokenAddress)
                    
    //             //     const approve = promisifyContractCall(
    //             //         tokenContract.methods.approve, 
    //             //         {
    //             //             from: issuer.address,
    //             //             gas: 40000,
    //             //             gasPrice
    //             //         }
    //             //     )

    //             //     await approve(bounties.contract.options.address, balance)
    //             // }

    //             const createBounty = bounties.factory.methods.createBounty, 
    //                 {
    //                     from: issuer.address,
    //                     value: paysTokens ? '0' : balance,
    //                     gas: 40000,
    //                     gasPrice
    //                 }
    //             )

    //             this.bounties.factory.methods.createBounty(
    //                 bounty
    //             )

    //             const transactionHash = await createBounty(
    //                 bounty.controller.address,
    //                 deadline,
    //                 ipfsHash,
    //                 fulfillmentAmount,
    //                 '0x000000000000000000000000000000000000dead',
    //                 paysTokens,
    //                 tokenAddress || '0x0000000000000000000000000000000000000000',
    //                 balance
    //             )
                
    //             resolve(transactionHash)
    //         } catch (e) {
    //             console.log(e)
    //             reject(e)
    //         }
    //     })
    // }

    /**
     * Drains a bounty at bountyAddress of all specified tokens
     * @param  {string} bountyAddress
     * @param  {string[]} payoutTokens
     * @param  {(number|string)[]} tokenVersions
     * @param  {BigNumber[]} tokenAmounts
     * @param  {BigNumber=new BigNumber(5)} gasPrice
     * @returns Promise<string>
     */
    drain(
        bountyAddress: string,
        payoutTokens: string[],
        tokenVersions: (number | string)[],
        tokenAmounts: BigNumber[],
        gasPrice: BigNumber = new BigNumber(5)
    ): Promise<string> 
    {
        return new Promise(async (resolve, reject) => {
            try {
                const bountyClient = this.bounties.bountyClient(bountyAddress)
                
                bountyClient.methods.drainBounty(
                    payoutTokens, 
                    tokenVersions, 
                    tokenAmounts.map(amount => amount.toString())
                )
                .send({
                    from: (await this.bounties._web3.eth.getAccounts())[0],
                    to: bountyClient._address,
                    gas: 40000,
                    gasPrice: gasPrice.toString()
                })
                .on('transactionHash', hash => resolve(hash))
                .on('error', error => reject(error))
            } catch(e) {
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