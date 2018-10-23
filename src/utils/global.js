import config from '../config';

export let web3 = {};

let API_ENDPOINT;
//let API_ENDPOINT = 'http://localhost:8000';
// update this to be an env passthrough
export const apiEndpoint = {
  set: endpoint => (API_ENDPOINT = endpoint),
  get: () => API_ENDPOINT
};

export const expandPlatforms = platforms =>
  flatten(map(platform => config.platforms[platform], platforms)).join(',');