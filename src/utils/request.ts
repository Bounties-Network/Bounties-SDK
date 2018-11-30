import axios, { AxiosRequestConfig, AxiosPromise, AxiosResponse } from 'axios';
import Bounties from '../bounties';
import {
    HTTP_401_UNAUTHORIZED,
    HTTP_200_OK,
    HTTP_403_FORBIDDEN,
    HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_300_MULTIPLE_CHOICES
} from './constants';


export class Request {
    _endpoint: string

    constructor(endpoint: string) {
        this._endpoint = endpoint
    }

    request(endpoint: string, relativePath: string, method: string = 'GET', options: AxiosRequestConfig): AxiosPromise {
        return axios
            .request({ url: `${endpoint}/${relativePath}`, ...HttpOptions[method.toUpperCase()], ...options })
            .then(checkRequestStatus)
            .catch(handleError);
    }

    get(url: string, query?: object): AxiosPromise {
        return this.request(this._endpoint, url, 'GET', { params: query })
    }

    post(url: string, data: object): AxiosPromise {
        return this.request(this._endpoint, url, 'POST', { params: data })
    }
}

export const HttpOptions: { [s: string]: HttpMethod } = {
    'PUT': {
        method: 'PUT',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json'
        },
        withCredentials: true
    },
    'POST': {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json'
        },
        withCredentials: true
    },
    'PATCH': {
        method: 'PATCH',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json'
        },
        withCredentials: true
    },
    'OPTIONS': {
        method: 'OPTIONS',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json'
        },
        withCredentials: true
    },
    'GET': {
        method: 'GET',
        withCredentials: true
    } 
}

// The type binds provided by Axios do not include 
// message or statusCode so they are inlined here.
interface AxiosError {
    config: AxiosRequestConfig,
    code?: string,
    request?: any,
    response?: AxiosResponse,
    statusCode?: number,
    message?: string
}

function handleError(err: AxiosError) {
    if (err.statusCode) {
        throw new Error(`${err.statusCode}`)
    }

    throw err;
}

function checkRequestStatus(response: AxiosResponse) {
    if (
        response.status >= HTTP_200_OK &&
        response.status < HTTP_300_MULTIPLE_CHOICES
    ) {
        return response.data;
    }
}
