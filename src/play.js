import tcp from './lib/com/surfaceCom/tcpsend';
import lineReader from 'line-reader';
import {tcpconfig} from './lib/com/config';
import discoverSurfaces from "./lib/com/surfaceCom/discoverSurfaces";
import fs from 'fs-extra';
import path from 'path';

//async function play({mac,ip,masterKey,visitorKey,file, config:configIn}) {
async function rePlay(params) {
    lineReader.eachLine(params.file, async (line, last, cb) => {
        try {
            const data = JSON.parse(line),
                config = {...data, ...params};
            if (config.port === tcpconfig.ports.master) {
                if (!config.masterKey)
                    throw 'masterKey not set. to use public port set port:5555 in config';
                config.key = config.masterKey;
                config.keyType = 'master';
            }
            if (config.port === tcpconfig.ports.visitor) {
                if (!config.masterKey)
                    throw 'visitorKey not set. to use public port set port:5555 in config';
                config.key = config.visitorKey;
                config.keyType = 'visitor';
            }

            console.log(config.ip, config.port, config.request)
            const response = await tcp(config.ip, config.request, config.key, config.keyType, {}, config, null)
            console.log(config.ip, config.port, response)
            cb(true)
        } catch (e) {
            console.log(e)
            cb(false)
        }
    });
}


export async function play({file, config,ip,mac,masterKey,visitorKey}) {
//fs.readFile(path.join(process.cwd(), 'reqs.log')).then(r => console.log(r.toString()))
   // console.log({file, config,ip,mac,masterKey,visitorKey})

    if(typeof config === 'string')
        config =  JSON.parse( await fs.readFile(path.join(process.cwd(), config)))

    const params = {...config,file}
    if (ip)
        params.ip = ip;
    if (mac)
        params.ip = await getSurface(mac);
    if (masterKey)
        params.masterKey = masterKey;
    if (visitorKey)
        params.visitorKey = visitorKey;


    //console.log(params)

   await rePlay(params)


}

function getSurface(mac) {
    return new Promise(resolve => {
        const cb = ({id, ip_address}) => {
            if (id === mac)
                resolve(ip_address)
        };
        discoverSurfaces({cb})
    })
}


//function create(config)