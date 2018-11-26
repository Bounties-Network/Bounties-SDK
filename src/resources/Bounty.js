import request from '../utils/request'
import { calculateDecimals, promisifyContractCall } from '../utils/helpers'
import { BigNumber } from 'bignumber.js'


export default class Bounty {
    constructor(bounties) {
        this.bounties = bounties
        this.request = bounties.request
    }

    load(id, params) {
        return this.request.get(`bounty/${id}/`, params) 
    }

    /*
    bounty = {
            title,
            body,
            categories,
            expectedNumberOfRevisions,
            hasPrivateFulfillments,
            difficulty,
            attachments: {
                ipfsHash,
                ipfsFileName,
                url,
            },
            metadata: this.bounties._meta 
        }
    */
    create(bounty, gasPrice=undefined) {
        return new Promise(async (resolve, reject) => {
            const bounties = this.bounties
            const { 
                tokenClient, 
                _ipfs: ipfs 
            } = bounties

            try {
                const ipfsHash = await ipfs.addJSON(bounty)
        
                if (paysTokens) {
                    const tokenContract = tokenClient(tokenAddress)
                    
                    const approve = promisifyContractCall(
                        tokenContract.methods.approve, 
                        {
                            from: issuer.address,
                            gas: 40000,
                            gasPrice
                        }
                    )

                    await approve(bounties.contract.options.address, balance)
                }

                const createBounty = promisifyContractCall(
                    bounties.factory.methods.createBounty, 
                    {
                        from: issuer.address,
                        value: paysTokens ? '0' : balance,
                        gas: 40000,
                        gasPrice
                    }
                )

                const transactionHash = await createBounty(
                    bounty.controller.address,
                    deadline,
                    ipfsHash,
                    fulfillmentAmount,
                    '0x000000000000000000000000000000000000dead',
                    paysTokens,
                    tokenAddress || '0x0000000000000000000000000000000000000000',
                    balance
                )
                
                resolve(transactionHash)
            } catch (e) {
                console.log(e)
                reject(e)
            }
        })
    }

    kill(id, issuerAddress, gasPrice=undefined) {
        const killBounty = promisifyContractCall(
            this.bounties.contract.methods.killBounty, 
            {
                from: issuerAddress,
                gas: 40000,
                gasPrice
            }
        )

        return killBounty(id)
    }

    generatePayload(values) {
        const {
            // issuer
            issuerAddress,
            issuerEmail,
            issuerName,

            // metadata
            title,
            description,
            categories,
            revisions,
            hasPrivateFulfillments,
            experienceLevel,
            deadline,
            uid,

            // attachments
            ipfsHash,
            ipfsFileName,
            url,

            // payment   
            paysTokens,
            tokenContract,
            tokenSymbol,
            balance,
            fulfillmentAmount,
        } = values;
    
        return 
        
    }
}