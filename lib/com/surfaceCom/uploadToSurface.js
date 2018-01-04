import tcpsend from './tcpSend';
import readFileToChunks from '../../fs/readFileToChunks';
import {adler32Hex,adler32Int} from '../../encrypt/adler32Hex';
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
        return await getFile(filename,type,ip,key,cb,stopper)
    }catch (e){
        console.log(e)
    }

}






async function getFile(filePath,type,ip, key, updater, stoper){
    //console.log(ip,key)
    try {
        key = key || config.key;
        //console.log(key)
        const
            {chunks, size, file, name} = await readFileToChunks(resolveHome(filePath), config.chunk_size),
            ending = (type === 'scene') ? '.scn': '',
            valPre = {
                filename: name + ending,
                file_size: size,
                file_adler32: adler32Hex(file),
            },setUpTcp = makeTcp(ip, key, 'master', {}, {
                log: false,
                timeout: config.timeout,
                delay: config.delay
            }, valPre);
        //console.log(key)
        const tcps = chunks.map((data, i) => {
            const val = {
                chunk_nr: i,
                chunk_length: data.length,
                chunk_adler32: adler32Hex(data),
            };
            return setUpTcp(val, data)
        });
        return await geny(tcps, 0, 0, updater,stoper);

    } catch (e) {
        throw {ip, error: e}
    }
}

function makeTcp(ip,  key, keyType, done, opts, valpre) {
    return (valIn, data = false) => {
        const newOpts = {
            ...opts,
            //log:true
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
            //console.log(cmd)

            return tcpsend(ip, cmd, key, keyType, done, newOpts, dataIn);

        }
    }
}

async function geny(array, ind, retrys ,updater,stoper) {
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
        const resChilds = await geny(array, nextChunk, retrys, updater,stoper);
        return [res].concat(resChilds);
    } catch (e) {
        updater({err: e, i: ind})
        throw [{err: e, i: ind}]
    }
};


function resolveHome(filepath) {
    if (filepath[0] === '~') {
        return path.join(process.env.HOME, filepath.slice(1));
    }
    return filepath;
}





