import { BigNumber } from 'bignumber.js';
import { Tx } from 'web3/eth/types';

export const calculateDecimals = (amount: BigNumber, decimals: number) => {
  const baseTen = new BigNumber(10, 10);
  const multiplyingDecimal = baseTen.exponentiatedBy(decimals);
  const amountBase = new BigNumber(amount, 10);
  return amountBase.times(multiplyingDecimal, 10).toString(10);
};

// export const readFile = file =>
//   new Promise((resolve, reject) => {
//     const reader = new window.FileReader();
//     reader.onloadend = () => {
//       resolve(reader);
//     };
//     reader.readAsArrayBuffer(file);
//   });

// export const promisify = inner =>
//   new Promise((resolve, reject) =>
//     inner((err, res) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(res);
//       }
//     })
//   );

// export const proxiedWeb3Handler = {
//   // override getter
//   get: (target, name) => {
//     const inner = target[name];
//     if (inner instanceof Function) {
//       // Return a function with the callback already set.
//       return (...args) => promisify(cb => inner(...args, cb));
//     } else if (typeof inner === 'object') {
//       // wrap inner web3 stuff
//       return new Proxy(inner, proxiedWeb3Handler);
//     } else {
//       return inner;
//     }
//   }
// };

// export const promisifyContractCall = (contractFunction: Function, options: object) => (
//   ...args: any[]
// ) => {
//   return new Promise((resolve, reject) => {
//     return contractFunction(...args)
//       .send(options)
//       .on('transactionHash', hash => resolve(hash))
//       .on('error', error => reject(error));
//   });
// };

// export const batchContractMethods = (...methods) => {
//   return new Promise((resolve, reject) => {
//     const batch = new this._web3.eth.BatchRequest();
//     let completedCount = 0;
//     const txHashes = [];
//     each((method, idx) => {
//       const [fn, web3Options] = method;
//       batch.add(
//         fn.request(web3Options, (err, txHash) => {
//           if (err) {
//             return reject(err);
//           }
//           txHashes[idx] = txHash;
//           if (++completedCount === methods.length) {
//             return resolve(txHashes);
//           }
//         })
//       );
//     }, methods);
//     batch.execute();
//   });
// };

// export const addBuffer = (add: Function) => (filename: string, bufferContent: Buffer) =>
//   new Promise((resolve, reject) => {
//     // due to es5 issues - we load this via a CDN
//     // const ipfs = window.IpfsApi({
//     //   host: 'ipfs.infura.io',
//     //   port: 5001,
//     //   protocol: 'https'
//     // });

//     add(
//       [{ path: `/bounties/${filename}`, content: bufferContent }],
//       (err: Error, response: any) => {
//         if (err) {
//           reject(err);
//         }
//         resolve(response[1].hash);
//       }
//     )
//   })

export const addJSON = (addJSON: Function) => (data: { [s: string]: [any] }) =>
  new Promise((resolve, reject) => {
    addJSON(data, (err: Error, response: string) => {
      if (err) reject(err)
      resolve(response)
    })
  })

// export const handleOnChainAction = (action: (...args: any) => string) => {
//   return new Promise((resolve, reject) => {
//     try {
//       resolve(action())
//     } catch(e) {
//       reject(e)
//     }
//   })
// }