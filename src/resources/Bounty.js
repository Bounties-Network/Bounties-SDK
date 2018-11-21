import request from '../utils/request'
import { calculateDecimals } from '../utils/helpers';
import { addJSON } from '../utils/ipfsClient';


export default class Bounty {
  constructor(bounties) {
    this._bounties = bounties
    this.request = bounties.request
  }

  load(id, params) {
    return this.request.get(`bounty/${id}/`, params) 
  }
}

/*
export function create(values) {
    const payload = generatePayload(values)
    const ipfsHash = addJSON(payload)
    const { standardBounties } = yield call(getContractClient);
  
    if (paysTokens) {
      const { tokenContract: tokenContractClient } = yield call(
        getTokenClient,
        tokenContract
      );
      try {
        const network = yield select(networkSelector);
        yield call(
          promisifyContractCall(tokenContractClient.approve, {
            from: userAddress
          }),
          config[network].standardBountiesAddress,
          contractBalance
        );
        yield call(delay, 2000);
        const issuedBountyHash = yield call(
          promisifyContractCall(standardBounties.issueAndActivateBounty, {
            from: userAddress,
            gas: 400000
          }),
          userAddress,
          deadline,
          ipfsHash,
          contractFulfillmentAmount,
          0x0,
          paysTokens,
          tokenContract || 0x0,
          contractBalance
        );
        yield put(setPendingReceipt(issuedBountyHash));
        return yield put(stdBountySuccess());
      } catch (e) {
        yield put(setTransactionError());
        return yield put(stdBountyFail());
      }
    }
  
    try {
      const txHash = yield call(
        promisifyContractCall(standardBounties.issueAndActivateBounty, {
          from: userAddress,
          value: contractBalance
        }),
        userAddress,
        `${deadline}`,
        ipfsHash,
        contractFulfillmentAmount,
        0x0,
        paysTokens,
        tokenContract || 0x0,
        contractBalance
      );


      yield put(setPendingReceipt(txHash));
      yield put(stdBountySuccess());
    } catch (e) {
      yield put(setTransactionError());
      yield put(stdBountyFail());
    }
  }


function generatePayload() {
    const {
        // issuer
        issuerEmail,
        issuerName,

        // metadata
        title,
        description,
        categories,
        revisions,
        hasPrivateFulfillments,
        experienceLevel,
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
        payload: {
        uid,
        title,
        description,
        sourceFileHash: '',
        sourceDirectoryHash: ipfsHash,
        sourceFileName: ipfsFileName,
        webReferenceURL: url,
        categories,
        revisions,
        privateFulfillments: hasPrivateFulfillments,
        created: parseInt(new Date().getTime() / 1000) | 0,
        tokenAddress: tokenContract || '',
        difficulty: experienceLevel,
        issuer: {
            address: userAddress,
            email: issuerEmail,
            name: issuerName
        },
        funders: [
            {
            address: userAddress,
            email: issuerEmail,
            name: issuerEmail
            }
        ],
        symbol: tokenSymbol
        },
        meta: {
        platform: config.settings.postingPlatform,
        schemaVersion: config.settings.postingPlatform,
        schemaName: config.settings.postingSchema
        }
    }
}
*/