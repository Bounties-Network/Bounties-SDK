import { Bounty } from '../models/Bounty'
import { Base } from '../Base'
import { Request } from '../utils/request'
// import { calculateDecimals } from '../utils/helpers'
import { map, size, isArray } from 'lodash'
import { BigNumber } from 'bignumber.js'
import BountiesClass from '../bounties'
import { rejects } from 'assert';
import { BountyData, MutableBountyData } from '../types/types';


export class Bounties extends Base {
    retrieve(
        address: string,
        params: { [key: string]: any } = { offline: false }
    ): Promise<Bounty> {
        return new Promise((resolve, reject) => {
            if (params.offline) resolve(new Bounty(this.bounties, address))


            // TODO retrieve bounty via HTTP
            // await result = this.request.get(`bounty/${address}/`, params)
            resolve(new Bounty(this.bounties, address))

        })
    }

    list(query?: object) {
        return
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
}