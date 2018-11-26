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

    create(values, gas=40000, gasPrice=5) {
        return new Promise(async (resolve, reject) => {
            const { contract: standardBounties, tokenClient, _ipfs: ipfs } = this.bounties

            const payload = this.generatePayload(values)
            const { balance, deadline, fulfillmentAmount, issuer, paysTokens, tokenContract: tokenAddress } = payload

            try {
                const ipfsHash = await ipfs.addJSON(payload)
        
                if (paysTokens) {
                    tokenContract = tokenClient(tokenAddress)
                    tokenContract.methods.approve(standardBounties.address, balance).send({ from: issuer.address })
                }

                const issueAndActivateBounty = promisifyContractCall(
                    standardBounties.methods.issueAndActivateBounty, {
                        from: issuer.address,
                        value: paysTokens ? '0' : balance,
                        gas: gas,
                        gasPrice: gasPrice
                    }
                )

                const txHash = await issueAndActivateBounty(
                    issuer.address,
                    deadline,
                    ipfsHash,
                    fulfillmentAmount,
                    '0x000000000000000000000000000000000000dead',
                    paysTokens,
                    tokenAddress || '0x0000000000000000000000000000000000000000',
                    balance
                )
                
                resolve(txHash)
            } catch (e) {
                console.log(e)
                reject(e)
            }
        })
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
    
        return {
            issuer: {
                address: issuerAddress,
                email: issuerEmail,
                name: issuerName
            },

            funders: [{
                address: issuerAddress,
                email: issuerEmail,
                name: issuerName
            }],

            // metadata
            title,
            description,
            categories,
            revisions,
            hasPrivateFulfillments,
            experienceLevel,
            deadline: deadline.toString(10),
            created: parseInt(new Date().getTime() / 1000) | 0,
            uid,

            // attachments
            ipfsHash,
            ipfsFileName,
            url,

            // payment   
            paysTokens,
            tokenContract,
            tokenSymbol,
            balance: balance.toString(10),
            fulfillmentAmount: fulfillmentAmount.toString(10),

            meta: this.bounties._meta 
        }
    }
}