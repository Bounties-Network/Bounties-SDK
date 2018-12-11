import Web3 from 'web3'
import { cloneDeep, findIndex, has, set } from 'lodash';
import { interfaces } from '../../src/contracts/interfaces'


const web3 = new Web3()

export const buildTxHash = (hashId: number) => {
    let hash = '0x7000000000000000000000000000000000000000000000000000000000000000'.slice(
        0, 66 - hashId.toString().length
    )
    return hash + hashId.toString()
}

export const buildAddress = (id: number) => {
    let address = '0xADD3255000000000000000000000000000000000'.slice(
        0, 42 - id.toString().length
    )
    return Web3.utils.toChecksumAddress(address + id.toString())
}

// must cast `encodeParameter` due to incorrect web3 type binding
export const encodeParameter = (type: string | object, parameter: any) => (
    (web3.eth.abi.encodeParameter as Function)(type, parameter).replace('0x', '')
)

export const encodeParameters = (types: string[], parameters: any[]) => (
    web3.eth.abi.encodeParameters(types, parameters)
)

export const methodSignature = (method: string) => (
    interfaces.StandardBounty[
        findIndex(interfaces.StandardBounty, item => item.name == method)
    ].signature.replace('0x', '')
)

export const sanitize = (data: any, keys: string[]) => (
    keys.reduce(
        (result, key) => (
            has(data, key)
                ? set(cloneDeep(result), key, '[SANITIZED]')
                : result
        ),
        data
    )
)
