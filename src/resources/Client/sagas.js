import web3 from '../utils/Web3Client';
import config from '../config';
import { proxiedWeb3Handler } from '../utils/helpers';
import {
  networkSelector,
  addressSelector,
  walletLockedSelector,
  hasWalletSelector,
  initializedSelector
} from '../Client/selectors';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { apiEndpoint } from '../utils/global';
import { actions, actionTypes } from '../Client';
import { BigNumber } from 'bignumber.js';

let proxiedWeb3;

const {
  setHasWallet,
  setNetwork,
  setLocked,
  setAddress,
  setInitialized,
  getTokenBalanceSuccess,
  getTokenBalanceFail
} = actions;

const { GET_TOKEN_BALANCE } = actionTypes;

function* getWalletAddress() {
  const accounts = yield proxiedWeb3.eth.getAccounts();
  return accounts[0];
}

function* isWalletLocked() {
  const accounts = yield proxiedWeb3.eth.getAccounts();
  return accounts.length === 0;
}

export function* getNetwork() {
  const networkID = yield proxiedWeb3.eth.net.getId();

  let network = 'unknown';
  if (networkID === 1) {
    network = 'mainNet';
    apiEndpoint.set(config.settings.url.mainNet);
  } else if (networkID === 4) {
    network = 'rinkeby';
    apiEndpoint.set(config.settings.url.rinkeby);
  } else {
    apiEndpoint.set(config.settings.url.mainNet);
  }

  return network;
}

export function* getWeb3Client() {
  let currentAddress = '';
  let isLocked = false;
  let currentNetwork = 'unknown';
  const wasLocked = yield select(walletLockedSelector);
  const prevAddress = yield select(addressSelector);
  const hadWallet = yield select(hasWalletSelector);
  const hasWallet =
    typeof window.web3 !== 'undefined' &&
    typeof window.web3.currentProvider !== 'undefined';
  const networkPrev = yield select(networkSelector);
  if (hasWallet !== hadWallet) {
    yield put(setHasWallet(hasWallet));
  }
  if (hasWallet) {
    web3.setProvider(window.ethereum || window.web3.currentProvider);
    proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);
    isLocked = yield call(isWalletLocked);
  }

  if (!hasWallet) {
    return null;
  }

  currentNetwork = yield call(getNetwork);

  if (!isLocked) {
    currentAddress = yield call(getWalletAddress);
  }
  if (isLocked !== wasLocked) {
    yield put(setLocked(isLocked));
  }
  if (currentAddress !== prevAddress) {
    yield put(setAddress(currentAddress));
  }

  if (currentNetwork !== networkPrev) {
    yield put(setNetwork(currentNetwork));
    if (networkPrev) {
      window.location.reload();
    }
  }

  return { web3, proxiedWeb3 };
}

export function* getContractClient(deployments, abi) {
  const { web3 } = yield call(getWeb3Client);
  const network = yield select(networkSelector);

  if (network !== 'unknown') {
    return new web3.eth.Contract(abi, deployments[network]).methods
  }

  return null;
}

export function* getTokenClient(tokenAddress, type = 'HumanStandardToken') {
  const { web3 } = yield call(getWeb3Client);
  const network = yield select(networkSelector);

  if (network !== 'unknown') {
    return {
      tokenContract: new web3.eth.Contract(
        config.settings.interfaces[type],
        tokenAddress
      ).methods
    };
  }
  return null;
}

export function* getTokenBalance(action) {
  const { address: tokenAddress } = action;
  const userAddress = yield call(getWalletAddress);
  const { web3 } = yield call(getWeb3Client);

  if (tokenAddress === '0x0000000000000000000000000000000000000000') {
    try {
      const balanceWei = yield call(web3.eth.getBalance, userAddress);
      const balanceEther = yield call(web3.utils.fromWei, balanceWei, 'ether');
      return yield put(getTokenBalanceSuccess([balanceEther, 'ether']));
    } catch (e) {
      return yield put(getTokenBalanceFail(e));
    }
  }

  try {
    // verify tokenAddress is a valid ERC-20 contract client, throw if not
    let symbol, decimals, balance;
    try {
      const token = yield call(getTokenClient, tokenAddress);
      const { tokenContract: tokenClient } = token;
      symbol = yield call(tokenClient.symbol().call);
      decimals = yield call(tokenClient.decimals().call);
      balance = yield call(tokenClient.balanceOf(userAddress).call);
    } catch (e) {
      // if it fails, it may be because the token uses a slightly
      // different abi (DAI does this for example) and symbol is a bytes32
      const token = yield call(getTokenClient, tokenAddress, 'DSToken');
      const { tokenContract: tokenClient } = token;
      symbol = web3.utils.hexToAscii(yield call(tokenClient.symbol().call));
      decimals = yield call(tokenClient.decimals().call);
      balance = yield call(tokenClient.balanceOf(userAddress).call);
    }

    const balanceBN = BigNumber(balance, 10);
    const decimalsBN = BigNumber(decimals, 10);

    yield put(
      getTokenBalanceSuccess([
        balanceBN.dividedBy(BigNumber(10).exponentiatedBy(decimalsBN)),
        symbol
      ])
    );
  } catch (e) {
    yield put(getTokenBalanceFail(e));
  }
}

export function* updateWalletData() {
  // every second and a half, network and wallet status is updated in the redux store
  while (true) {
    if (config.settings.initialized) {
      const isInitialized = yield select(initializedSelector);
      yield call(getWeb3Client);
      if (!isInitialized) {
        yield put(setInitialized());
      }
    }
    yield delay(1000);
  }
}

export function* watchGetTokenBalance() {
  yield takeLatest(GET_TOKEN_BALANCE, getTokenBalance);
}

export default [updateWalletData, watchGetTokenBalance];
