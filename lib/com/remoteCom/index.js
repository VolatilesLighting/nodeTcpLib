/**
 * Created by flomair on 06.03.17.
 */
import {backend as config} from '../config';
import paths from './remotePaths.json';
import base64 from 'base-64';

import RNFetchBlob from 'react-native-fetch-blob'


const Fetch = RNFetchBlob.polyfill.Fetch;
// replace built-in fetch
window.fetch = new Fetch({
    auto: true,
    trusty : config.trusty,
    binaryContentTypes: [
        'image/',
        'video/',
        'audio/',
        'foo/',
    ]
}).build()


const getHeaders = (user, contentTypeIn) => {
    const header = {};
    switch (contentTypeIn) {
        case 'json':
            header['Content-Type'] = 'application/json';
            break;
        case 'form':
            header['Content-Type'] = 'application/x-www-form-urlencoded';
            break;
        default:
            header['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    if (user)
        header.Authorization = auth(user)

    return header;
};

export const auth = user => {
    return 'Basic ' + base64.encode(`${user.email}:${user.password}`)
};

const resolveRoute = route => {
    const {path, method, contentType} = paths[route];
    if (!path || !method)
        throw "route not defined";
    return {path, method, contentType};
};

export default async(route, preparams, user) => {
    const host = config.host;
    const {path, method, contentType} = resolveRoute(route);
    let url = `${host}${path}`;
    let params = false;
    if (method === 'GET') {
        if (typeof preparams === 'string') {
            url = url + preparams;
        } else if (typeof preparams === 'object') {
            url = url + Object.keys(preparams).map((i) => i + '=' + preparams[i]).join('&');
            params = null;
        }
    } else {
        params = preparams;
    }
    const options = Object.assign({method}, params ? {body: JSON.stringify(params)} : null);
    options.headers = getHeaders(user, contentType);
    return simplefetch(url, options)
}

const simplefetch = async(url, options) => {
        //console.log(url, options)
        try {
            const answer = await fetch(url, options)
            if (answer.ok)
                return answer.json();
            throw answer.status;
        } catch (e) {
            throw e
        }
    };