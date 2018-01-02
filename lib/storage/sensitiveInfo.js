import SInfo from 'react-native-sensitive-info';
import config from './config.json';
import {Platform} from 'react-native';


export async function getItem(item) {
    let val = await SInfo.getItem(item, config);
    return tryJson(val)
}

export function deleteItem(item) {
    return SInfo.deleteItem(item, config);
}

export async function getAll() {
    const data = {},
        val = await SInfo.getAllItems(config);
    //console.log(val[0])
    if (val[0] === [])
        return [];
    if (Platform.OS === 'ios') {
        const val2 = val[0]
        for (let v in val2) {
            data[val2[v].key] = tryJson(val2[v].value)
        }
    } else {

        for (let v in val) {
            if (val.hasOwnProperty(v)) {

                data[v] = tryJson(val[v]);
            }
            data[v] = tryJson(val[v]);
        }
    }
    //console.log(data)
    return data
}

export async function setItem(item, value) {
    return SInfo.setItem(item, makeString(value), config);
}

const tryJson = (val) => {
    try {
        return JSON.parse(val);
    } catch (e) {
        return val
    }
};

const makeString = (val) => {
    if (typeof val === "string")
        return val;
    try {
        return JSON.stringify(val);
    } catch (e) {
        return val
    }
};