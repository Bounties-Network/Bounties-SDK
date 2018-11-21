import axios from 'axios';

import {
  HTTP_401_UNAUTHORIZED,
  HTTP_200_OK,
  HTTP_403_FORBIDDEN,
  HTTP_500_INTERNAL_SERVER_ERROR,
  HTTP_300_MULTIPLE_CHOICES
} from './constants';

const POST_OPTIONS = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json'
  },
  withCredentials: true
};

const PUT_OPTIONS = {
  method: 'PUT',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json'
  },
  withCredentials: true
};

const PATCH_OPTIONS = {
  method: 'PATCH',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json'
  },
  withCredentials: true
};

const OPTIONS_OPTIONS = {
  method: 'OPTIONS',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json'
  },
  withCredentials: true
};

const GET_OPTIONS = {
  method: 'GET',
  withCredentials: true
};

const OPTIONS = {
  'PUT': PUT_OPTIONS,
  'POST': POST_OPTIONS,
  'PATCH': PATCH_OPTIONS,
  'OPTIONS': OPTIONS_OPTIONS,
  'GET': GET_OPTIONS
}

function handleError(err) {
  const error = new Error();
  error.errorStatus = '';
  if (err.response) {
    const response = err.response;
    if (
      response.status === HTTP_401_UNAUTHORIZED ||
      response.status === HTTP_403_FORBIDDEN
    ) {
      // include redirect-type logic in here
    }

    if (response.status >= HTTP_500_INTERNAL_SERVER_ERROR) {
      error.errorStatus = response.status;
      error.errorMessage = response.statusText;
      throw error;
    }

    error.errorStatus = response.status;
  }

  error.errorMessage = err.message;
  throw error;
}

function checkRequestStatus(response) {
  if (
    response.status >= HTTP_200_OK &&
    response.status < HTTP_300_MULTIPLE_CHOICES
  ) {
    return response.data;
  }
}

export default class Request {
  constructor(bounties) {
    this._bounties = bounties
    this._endpoint = bounties._endpoint
  }

  request(url, endpoint, method='GET', options, customErrorHandler) {
    const requestUrl = url.slice(0, 4) === 'http' ? url : `${endpoint}/${url}`;
    return axios
      .request(requestUrl, { ...OPTIONS[method.toUpperCase()], ...options })
      .then(checkRequestStatus)
      .catch(handleError);
  }
 
  get(url, query, customErrorHandler) { 
    return this.request(url, this._endpoint, 'GET', { params: query }, customErrorHandler) 
  }
  
  post(url, data, customErrorHandler) { 
    return this.request(url, this._endpoint, 'POST', { params: data }, customErrorHandler) 
  }
}
