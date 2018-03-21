import aes from '../lib/encrypt/aes';
import net from 'net';
import {Address6} from 'ip-address';

import tcpSend from "../lib/com/surfaceCom/tcpsend";
import {tcpconfig as config} from '../lib/com/config';


import bunyan from 'bunyan';
let reqin = 0;
const log = bunyan.createLogger({
        name: "volatool", streams: [{
            path: 'volaTool.log',
        }
        ]
    }),
    log2 = bunyan.createLogger({
        name: "volatoolReqs", streams: [{
            path: 'reqs.log'
        }]
    }),
    log3 = bunyan.createLogger({
        name: "volatoolReqResp", streams: [{
            path: 'reqResp.log'
        }]
    })


function logThis(data) {
    log.info(data)
    // console.log(data)
}

function logReq({ip, data, port}) {

    console.log(Date.now()+'', ip,' ', JSON.stringify(data))
    reqin = Date.now();
    log3.info({request: data})
    log2.info({request: data,ip,port})
}

function logResp({ip, data}) {
    console.log(Date.now()+'', ip,' ', JSON.stringify(data))
    console.log(Date.now() - reqin + ' ms\n')
    log3.info({response: data})

}

export default ({remoteIP, masterKey = '', visitorKey = ''}) => {
    try {

        const proxies = setUpProxy(beautyIp(remoteIP));

        proxies({});

        // if (masterKey)
        proxies({type: 'master', key: masterKey});

        // if (visitorKey)
        proxies({type: 'visitor', key: visitorKey});


    } catch (e) {
        console.log(e)
    }
}


function setUpProxy(remoteIP) {
    return function openPort({type = 'public', key}) {
        const port = config.ports[type];

        const server = net.createServer((socket) => {
            const remoteAddress = beautyIp(socket.remoteAddress);
            logThis({remoteAddress, port, action: 'clientConnect'})


            socket.on('data', async (data) => {


                const {niceData, iv} = await getNiceData(data, key);

                logThis({remoteAddress, port, action: 'request', req: niceData})
                logReq({data: niceData.op ? niceData.op : niceData, ip: remoteAddress,port})

                if (isPubInfo(niceData)) {
                    const enc = await tcpSend(remoteIP, {get_pub_info: null}, key, type, {}, {})
                    socket.end(enc);
                } else {
                    const onEnd = (c) => {
                            logThis({action: 'surfaceClose', bytesWritten: c.bytesWritten, bytesRead: c.bytesRead});
                            socket.end();
                        },
                        onData = (data) => {
                            getNiceDataRemote(data, key, iv).then(niceDataSurface => {
                                logThis({remoteAddress: remoteIP, port, action: 'response', resp: niceDataSurface})

                                logResp({
                                    data: niceDataSurface.response ? niceDataSurface.response : niceDataSurface,
                                    ip: remoteIP
                                })

                            }).catch(e => console.log(e))
                            socket.write(data)
                        };
                    /// callSurface({host: remoteIP, port, data, onData, onEnd,log})

                    const client = net.createConnection({port, host: remoteIP}, () => {
                        client.write(data);
                    });
                    client.on('connect', () => logThis({
                        remoteAddress: socket.remoteAddress,
                        port,
                        action: 'surfaceConnect'
                    }));
                    client.on('data', onData);
                    client.on('end', () => onEnd(client));

                }
            });

            socket.on('end', () => {

                logThis({action: 'clientClose', bytesWritten: socket.bytesWritten, bytesRead: socket.bytesRead});

                //socket.end();
            });

        });


        server.on('error', (err) => {
            console.log(err)
            // openPort
            // throw err;
        });

        server.listen(port);
        return server
    }
}


function isPubInfo(data) {
    try {
        return JSON.parse(data).op.get_pub_info === null
    } catch (e) {
        return false;
    }
}


async function getNiceData(data, key) {
    // console.log(key)
    const iv = data.slice(0, 16),
        niceDataPre = key ? await aes.decryptServer(data, key, iv) : data.toString(),
        niceData = getJSON(niceDataPre);
    //console.log(niceData)

    return {niceData, iv: key ? iv : ''}
}

async function getNiceDataRemote(data, key, iv) {
    return getJSON(key ? await aes.decrypt(data, key, iv) : data.toString());

}

function getJSON(string) {
    try {
        return JSON.parse(string)
    }
    catch (e) {
        return string;
    }
}


function beautyIp(ip) {
    return ip.replace('::ffff:','')
}