import tcpsend from './tcpSend';
import readFileToChunks from '../../storage/filesystem/readFileToChunks';
import {adler32Hex} from '../../encrypt/adler32Hex';
import path  from 'path';
import {update as config} from '../config.json';


export default async(firmware, ip, key, updater, stoper) => {
    try {
        const
            key = key || config.key,
            {chunks, size, file, name} = await readFileToChunks(firmware, config.chunk_size),
            valPre = {
                filename: name,
                file_size: size,
                file_adler32: adler32Hex(file),
            }, setUpTcp = makeTcp(ip, "firmware_update", key, 'master', {}, {
                log: true,
                timeout: config.timeout,
                delay: config.delay
            }, valPre);
        //console.log(chunks,size,file,name)
        const tcps = chunks.map((data, i) => {
            const val = {
                chunk_nr: i,
                chunk_length: data.length,
                chunk_adler32: adler32Hex(data),
            };
            return setUpTcp(val, data)
        });
        const list = await geny(tcps, 0, 0, updater, stoper);
        //console.log(list)
        if (list[list.length - 1] === 'successful') {
            return await getFirmwareVersion(ip, key);
        }

    } catch (e) {
        throw {ip, error: e};
    }
}

function makeTcp(ip, command, key, keyType, done, opts, valpre) {
    return (valIn, data = false) => {
        const newOpts = {
            ...opts
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

async function geny(array, ind, retrys, updater, stoper) {
    try {
        if (array.length === ind)
            return ['done'];
        if (stoper.stoped)
            return ['stoped'];
        const res = await array[ind]();
        //console.log(ind, res)
        if (Object.keys(res).includes('Error')) {
            updater(res['Error']);
            throw {err: res['Error'], index: ind};
        }
        updater(null, array.length, ind);
        if (res.firmware_update === 'successful') {
            return res.firmware_update;
        }
        const nextChunk = res.firmware_update.next_chunk_nr;
        if (nextChunk === ind) {
            if (retrys === config.retrys && !stoper.stoped)
                throw {err: 'retrys' + retrys, index: ind};
            retrys = retrys + 1;
        } else {
            retrys = 0
        }
        const resChilds = await geny(array, nextChunk, retrys, updater, stoper);
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


async function getFirmwareVersion(ip, key) {
    try {
        const res = await tcpsend(ip, {get_surface_info: null}, key, 'master', {}, {})
        return res.firmware_version
    }
    catch (e) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(getFirmwareVersion(ip, key));
            }, 1000)
        })


    }

}
