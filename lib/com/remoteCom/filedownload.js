/**
 * Created by flomair on 29.03.17.
 */
import RNFetchBlob from 'react-native-fetch-blob';
import {auth} from './index';
import {backend as config} from '../config';
import paths from './downloadPaths.json';
import {adler32Hex} from '../../encrypt/adler32Hex';

/***
 *
 * @param type :string  can be scene,picture,firmware
 * @param payload :string scene, picture, firmware to be loaded
 * @param user :object state user
 * @returns {Promise.<void>}
 */
// @flow
const download = async(type: ("picture" | "scene" | "firmware" | "playlist"), payload: string, user: {email: string, password: string}, runs: ?number, saveTo :string ='') => {
    const {remote, local} = paths[type],

        path = `${remote}${payload}`,
        file = (saveTo !='') ? `${local}${saveTo}` : `${local}${payload}`,
        host = config.host,
        url = `${host}${path}`,
        dir = RNFetchBlob.fs.dirs.DocumentDir;
    try {
        //console.log(dir + file +saveTo)

        const res = await RNFetchBlob
            .config({
                fileCache: true,
                'RNFB-Response': 'base64',
                trusty : config.trusty,
                path: dir + file
            }).fetch('GET', url, {
                Authorization: auth(user),
            });

        /*
        const haserr = await res.json();
        if(haserr.code === 404){
            console.log(url, ' => ', haserr);
            return download(type,payload,user,runs +1 );
        }

        //const bl = await res.blob()
        let [base64Str,path] = ['',]
        if(type !='picture'){

        }else
        let [base64Str,path] = await Promise.all([res.base64(),res.path()])


        console.log(adler32Hex(base64Str))



          return {path, adler32: adler32Hex(base64Str),type}
         */
        return res.path();
    }catch (e) {
        //console.log(url,runs < config.downloadRetries)
        if (runs < config.downloadRetries) {
           return download(type,payload,user,runs +1 )
        }else{
            throw (`Download Error : ${url}`)
        }
    }
};

export default download;

/*

const download = async(type: ("picture" | "scene" | "firmware" | "playlist"), payload: string, user: {email: string, password: string}, runs: ?number, saveTo: string = '') => {
    try {

        const {remote, local} = paths[type],
            file = (type != 'picture')? `${dir}${local}${payload}`:`${dir}${local}${getSaveTo(payload,saveTo)}` ,
            path = `${remote}${payload}`,
            url = `${host}${path}`;

        // console.log(file,url)

        if (type === 'picture') {
            console.log(host, file)
        } else {
            console.log(file)
        }


        const res = await RNFetchBlob
            .config({
                fileCache: true,
                'RNFB-Response': 'base64',
                trusty: config.trusty,
                path: file
            }).fetch('GET', url, {
                Authorization: auth(user),
            });

        return res.path();
    } catch (e) {
        //console.log(url,runs < config.downloadRetries)
        if (runs < config.downloadRetries) {
            return download(type, payload, user, runs + 1, saveTo)
        } else {
            throw (`Download Error : ${payload}`,e)
        }
    }
};

export default download;


function getSaveTo(payload,saveTo){
    if(saveTo === '')
        return payload;
    const pre = payload.split('/'),
        post =pre[pre.length-1].split('.');
    return `/${post[0]}-${saveTo}.${post[1]}`
}
 */