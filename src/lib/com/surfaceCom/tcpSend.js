import net from 'net';
import {tcpconfig as config} from '../config';
import {Buffer} from 'buffer';
import crc32 from '../../encrypt/crc32';
import aes from '../../encrypt/aes';
import wait from '../../helpers/wait';
import CONSTS from '../CONSTS';

let dat;

export default async(ip, message, key, keyType, done, settingsPre, data) => {

    let response,
        error,
        port = config.ports.public,
        iv,
        messageOut = crc32.make(message);

    const encrypted = (key && key != '' && keyType);
    const settings = {
        ...config.settings,
        ...settingsPre
    };
    if (settings.log)
        console.log(ip, message, key, keyType, done, settingsPre);
    if (data) {
        messageOut = message + '\r' + data;
        dat = data;
    }
    if (encrypted) {
        port = config.ports[keyType];
        messageOut = await aes.encrypt(messageOut, key);
        iv = messageOut.slice(0, 16);
        if (settings.log) {
            console.log(messageOut)
        }
    }


    const lastResponses = [];

    for (let i = 1; i <= settings.decryptionRetrys; i++) {
        try {
            response = await tcpHandler(ip, port, messageOut, done, settings);
            if (done.isDone)
                return;
            if (encrypted) {
                try {
                    response = await aes.decrypt(response, key, iv);
                    JSON.parse(Buffer(response).toString());
                } catch (e) {
                    lastResponses.push(response);
                    if (i < settings.decryptionRetrys)
                        continue;
                    if (lastResponses.filter(item => Buffer(item).toString() == Buffer(response).toString()).length > 1) {
                        if (settings.log)
                            console.log(response, e);
                        error = CONSTS.messages.AES;
                    }
                    break;
                }
            }

            try {
                if (data) {
                    //console.log(Buffer(response).toString())
                    return JSON.parse(Buffer(response).toString());
                }

                if (settings.log)
                    console.log(crc32.validate(Buffer(response).toString()));
                return crc32.validate(Buffer(response).toString());
            } catch (e) {

            }

        } catch (e) {
            if (settings.log)
                console.log('dd', e);
            error = e;
            // if (i === settings.decryptionRetrys)
            break;
        }
    }

    throw error;
};

const tcpHandler = async(ip, port, req, done, settings) => {
    let error;
    for (let i = 0; i < settings.retrys; i++) {
        if (done.isDone)
            return 'OBSOLETE';
        try {
            return await dotcp(ip, port, req, settings, i);
        } catch (e) {
            error = e;
            if (i === settings.retrys) {
                break;
            }
            if (done.isDone)
                return 'OBSOLETE';
            await wait(settings.delay);
        }
    }
    throw error;
};


const dotcp = (ip, port, message, settings, i) => {
    return new Promise((resolve, reject) => {
        let done = false;
        //console.time('tcp')
        try {
            /*

             */
            if (settings.log)
                console.log('connPre', ip, port, settings.timeout,message);


            const timedOut = setTimeout(() => {
                client.destroy();
                reject(CONSTS.messages.TCP_TIMEOUT)
            }, settings.timeout);


            let client = new net.Socket({setTimeout: settings.timeout});

           // console.time('tcp')


            client.connect(port, ip, () => {
                //client.connect(port, '192.168.1.183', () => {
                if (settings.log)
                    console.log('conn', ip, port);
                client.write(message);
            });


            client.on('connect', (e) => {

                //client.write(dat);
            });

            /*


             let client = net.createConnection({port,host:ip,setTimeout:settings.timeout},()=>{
             console.timeEnd('tcp1')
             console.time('tcp2')
             //client.end()
             // console.timeEnd('Timer name');
             // console.time('tcp');
             client._write(messsage);
             //client.write(dat);
             });




             let client = new net.Socket({setTimeout: settings.timeout});
             client.connectAndSend({port,host:ip},messsage);
             //client.connectAndSend({port:5000,host:'192.168.2.154'},messsage);

             */


            client.on('data', (data) => {
              //  console.timeEnd('tcp')
                //console.log('data', data,Buffer(data).toString());
                client.destroy()
                // console.timeEnd('tcp');
                if (settings.log)
                    console.log('data', Buffer(data).length);
                clearTimeout(timedOut)
                if (!done) {
                    done = true;
                    resolve(data);
                }

            });

            client.on('error', (e) => {
             //   console.log(e)
             //   console.timeEnd('tcp')

                client.destroy()
                clearTimeout(timedOut)
                if (settings.log)
                    console.log('1', i, ip);
                if (!done) {
                    done = true;
                    reject(CONSTS.messages.TCP_NO_CONNECTION);
                }

            });

        } catch (e) {
            if (settings.log)
                console.log('2', e);
            if (!done) {
                done = true;
                reject(e);
            }
        }
    })
};



