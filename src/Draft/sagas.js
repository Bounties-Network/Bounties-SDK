import request from '../utils/request';
import moment from 'moment';
import config from '../config';
import siteConfig from '../config';
import { delay } from 'redux-saga';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { actionTypes, actions } from './';
import { actions as transactionActions } from '../Transaction';
import { BigNumber } from 'bignumber.js';
import { addressSelector } from '../Client/selectors';
import { calculateDecimals, promisifyContractCall } from '../utils/helpers';
import { addJSON } from '../utils/ipfsClient';
import { DIFFICULTY_VALUES } from './constants';
import { networkSelector } from '../Client/selectors';
import { getCurrentUserSelector } from '../Authentication/selectors';
import {
  getContractClient,
  getWeb3Client,
  getTokenClient
} from '../Client/sagas';

const {
  CREATE_DRAFT,
  UPDATE_DRAFT,
  CREATE_BOUNTY,
  GET_DRAFT,
  GET_BOUNTY,
  KILL_BOUNTY,
  ACTIVATE_BOUNTY,
  EXTEND_DEADLINE,
  INCREASE_PAYOUT,
  CONTRIBUTE,
  TRANSFER_OWNERSHIP
} = actionTypes;
const {
  getBountySuccess,
  getBountyFail,
  createDraftSuccess,
  createDraftFail,
  stdBountySuccess,
  stdBountyFail,
  getDraftSuccess,
  getDraftFail
} = actions;

const {
  setPendingWalletConfirm,
  setTransactionError,
  setPendingReceipt
} = transactionActions;


export function* load(action) {
  const { id } = action;
  const params = {
    platform__in: config.settings.platform
  };

  try {
    const endpoint = `bounty/${id}/`;
    const bounty = yield call(request, endpoint, 'GET', { params });
    yield put(getBountySuccess(bounty));
  } catch (e) {
    yield put(getBountyFail(e));
  }
}

export function* create(action) {
}

export function* createOrUpdateDraft(action) {
  const { values, bountyId } = action;
  const draftBountyData = {
    ...values,
    private_fulfillments: values.privateFulfillments,
    platform: config.settings.postingPlatform
  };
  draftBountyData.experienceLevel =
    DIFFICULTY_VALUES[draftBountyData.experienceLevel];

  const { paysTokens } = draftBountyData;
  const { web3 } = yield call(getWeb3Client);
  if (!paysTokens) {
    draftBountyData.fulfillmentAmount = web3.utils.toWei(
      draftBountyData.fulfillmentAmount,
      'ether'
    );
  } else {
    const { tokenContract } = draftBountyData;
    try {
      const { symbol, decimals } = yield call(getTokenData, tokenContract);
      draftBountyData.tokenSymbol = symbol;
      draftBountyData.tokenDecimals = BigNumber(decimals, 10).toString();
      draftBountyData.fulfillmentAmount = calculateDecimals(
        draftBountyData.fulfillmentAmount,
        decimals
      );
    } catch (e) {
      console.log(e);
      // call error toast here - contract isn't a proper erc20 token.
    }
  }
  draftBountyData.deadline = moment(draftBountyData.deadline)
    .utc()
    .toISOString();

  try {
    let endpoint = 'bounty/draft/';
    let methodType = 'POST';
    if (action.type === UPDATE_DRAFT) {
      methodType = 'PUT';
      endpoint += `${bountyId}/`;
    }

    const bounty = yield call(request, endpoint, methodType, {
      data: draftBountyData
    });
    yield put(createDraftSuccess(bounty));
  } catch (e) {
    yield put(createDraftFail(e));
    // error toast here as well
  }
}



export function* getDraft(action) {
  const { id, issuer } = action;
  const params = {
    issuer,
    platform__in: config.settings.platform
  };

  try {
    const endpoint = `bounty/draft/${id}/`;
    const bounty = yield call(request, endpoint, 'GET', { params });
    yield put(getDraftSuccess(bounty));
  } catch (e) {
    yield put(getDraftFail(e));
  }
}


export function* watchCreateDraft() {
  yield takeLatest([CREATE_DRAFT, UPDATE_DRAFT], createOrUpdateDraft);
}

export function* watchCreateBounty() {
  yield takeLatest(CREATE_BOUNTY, createBounty);
}

export function* watchGetDraft() {
  yield takeLatest(GET_DRAFT, getDraft);
}

export function* watchGetBounty() {
  yield takeLatest(GET_BOUNTY, getBounty);
}

export function* watchKillBounty() {
  yield takeLatest(KILL_BOUNTY, killBounty);
}

export function* watchActivateBounty() {
  yield takeLatest(ACTIVATE_BOUNTY, activateBounty);
}

export function* watchExtendDeadline() {
  yield takeLatest(EXTEND_DEADLINE, extendDeadline);
}

export function* watchIncreasePayout() {
  yield takeLatest(INCREASE_PAYOUT, increasePayout);
}

export function* watchTransferIssuer() {
  yield takeLatest(TRANSFER_OWNERSHIP, transferIssuer);
}

export function* watchContribute() {
  yield takeLatest(CONTRIBUTE, contribute);
}

export default [
  watchGetDraft,
  watchCreateDraft,
  watchCreateBounty,
  watchGetBounty,
  watchKillBounty,
  watchActivateBounty,
  watchExtendDeadline,
  watchIncreasePayout,
  watchTransferIssuer,
  watchContribute
];
