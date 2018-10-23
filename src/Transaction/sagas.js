import request from '../utils/request';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import config from '../config';
import { networkSelector } from '../Client/selectors';
import { getWeb3Client } from '../Client/sagas';
import {
  transactionsSelector,
  getTransactionSelector,
  transactionsInitiatedSelector
} from './selectors';
import { getUserAddressSelector } from '../Authentication/selectors';
import { actions, actionTypes } from './';

const {
  loadTransactions,
  loadTransactionsSuccess,
  loadTransactionsFail,
  postTransaction,
  postTransactionSuccess,
  postTransactionFail,
  addTransaction,
  setTransactionCompleted
} = actions;

const {
  LOAD_TRANSACTIONS,
  POST_TRANSACTION,
  SET_PENDING_RECEIPT,
  ADD_TRANSACTION,
  SET_TRANSACTION_COMPLETED
} = actionTypes;

export function* loadTransactionsSaga(action) {
  try {
    const address = yield select(getUserAddressSelector);
    if (!address) {
      return null;
    }

    const { proxiedWeb3: web3 } = yield call(getWeb3Client);
    const transactions = yield select(transactionsSelector);

    for (let key in transactions) {
      const transaction = transactions[key];
      if (transaction.completed) continue;
      // TODO parallelize
      const status = yield web3.eth.getTransaction(transaction.hash);

      if (status.blockNumber) {
        yield put(setTransactionCompleted(transaction.hash));
      }
    }

    yield put(loadTransactionsSuccess());
  } catch (e) {
    console.log(e);
    yield put(loadTransactionsFail(e));
  }
}

export function* pendingReceiptSaga(action) {
  const { txHash } = action;
  yield put(
    addTransaction(
      {
        completed: false,
        hash: txHash
      },
      txHash
    )
  );
}

export function* watchPendingReceipt() {
  yield takeLatest(SET_PENDING_RECEIPT, pendingReceiptSaga);
}

export function* watchTransactions() {
  yield takeLatest(LOAD_TRANSACTIONS, loadTransactionsSaga);
}

export function* loopTransactions() {
  while (true) {
    yield put(loadTransactions());
    yield delay(2000);
  }
}

export default [
  loopTransactions,
  watchTransactions,
  watchPendingReceipt
];
