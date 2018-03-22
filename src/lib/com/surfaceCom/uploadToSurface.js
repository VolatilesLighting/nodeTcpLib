import tcpsend from './tcpSend';
import readFileToChunks from '../../fs/readFileToChunks';
import {adler32Hex} from '../../encrypt/adler32Hex';
import {update as config} from '../config.json';
import path  from 'path';
const command = "upload_file";





export default async({filename,type,ip,key,cb,stopper}) =>{
    if(!cb)
        cb = () =>{};
    if(!stopper)
        stopper ={};
    if(!type){
        type ='';
    }


    try{
        return await getFile(filename,type,ip,key,'master',cb,stopper)
    }catch (e){
        console.log(e)
    }

}







async function getFile(filepath,type,ip, key,keyType, updater, stoper){
    try {
        key = key || config.key;
        const {chunks, size, file, name} = await readFileToChunks(filepath, config.chunk_size),
            ending = (type === 'scene') ? '.scn': '',
            command = (type === 'firmware') ? "firmware_update" : "upload_file",
            valPre = {
                filename: name + ending,
                file_size: size,
                file_adler32: adler32Hex(file),
            },setUpTcp = makeTcp(ip, key, keyType, {}, {
                log: false,
                timeout: config.timeout,
                delay: config.delay
            }, valPre,command);
        updater(null,chunks.length,-1)
        const tcps = chunks.map((data, i) => {
            const val = {
                chunk_nr: i,
                chunk_length: data.length,
                chunk_adler32: adler32Hex(data),
            };
            return setUpTcp(val, data, i === chunks.length -1)
        });
        return await geny(tcps, 0, 0, updater,stoper,command);

    } catch (e) {
        throw {ip, error: e}
    }
}

function makeTcp(ip,  key, keyType, done, opts, valpre, command) {
    return (valIn, data = false,last) => {
        const newOpts = {
            ...opts,
            timeout: (last && command === 'firmware_update') ? config.timeoutLast :config.timeout
        };
        const val = {
            ...valpre,
            ...valIn
        };
        return () => {
            let useHexString, dataIn;
            if (config.useHex) {
                useHexString = ', "encoding":"hex"';
                dataIn = data.toString('hex')
            } else {
                useHexString = '';
                dataIn = data
            }

            const cmd = `{"${command}": {"filename":"${val.filename}","file_size":${val.file_size},"file_adler32": ${val.file_adler32},"chunk_adler32": ${val.chunk_adler32}, "chunk_nr": ${val.chunk_nr},"chunk-size":${val.chunk_length}${useHexString}}}`;
            // console.log(cmd)

            return tcpsend(ip, cmd, key, keyType, done, newOpts, dataIn);

        }
    }
}

async function geny(array, ind, retrys ,updater,stoper,command) {
    try {
        if (array.length === ind)
            return ['done'];
        if(stoper.stoped)
            return ['stoped'];
        const res = await array[ind]();
        //console.log(ind, res)
        if (Object.keys(res).includes('Error')) {
            updater(res['Error']);
            throw {err: res['Error'], index: ind};
        }
        updater(null, array.length, ind);
        //console.log(res[command])
        if (res[command] === 'successful'){
            return res[command];
        }
        const nextChunk = res[command].next_chunk_nr;
        if(nextChunk === ind){
            if(retrys === config.retrys)
                throw {err: 'retrys' + retrys, index: ind};
            retrys  = retrys+1;
        }else{
            retrys = 0
        }
        const resChilds = await geny(array, nextChunk, retrys, updater,stoper,command);
        return [res].concat(resChilds);
    } catch (e) {
        updater({err: e, i: ind})
        throw [{err: e, i: ind}]
    }
};








