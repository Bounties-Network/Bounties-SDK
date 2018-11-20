export function* getTokenData(tokenAddress) {
  let symbol, decimals;
  try {
    const { tokenContract: tokenContractClient } = yield call(
      getTokenClient,
      tokenAddress
    );
    symbol = yield call(tokenContractClient.symbol().call);
    decimals = yield call(tokenContractClient.decimals().call);
  } catch (e) {
    const { tokenContract: tokenContractClient } = yield call(
      getTokenClient,
      tokenAddress,
      'DSToken'
    );
    symbol = yield call(tokenContractClient.symbol().call);
    decimals = yield call(tokenContractClient.decimals().call);
  }
  return {
    symbol,
    decimals
  };
}