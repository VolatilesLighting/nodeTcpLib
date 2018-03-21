/**
 * Created by flomair on 28.07.17.
 */
import dgram from 'dgram';
import network  from 'network';
import {Addr}  from 'netaddr';
import {udp as config} from '../config.json'
const subNetTable = {
    "255.255.255.252": "/30",
    "255.255.255.248": "/29",
    "255.255.255.240": "/28",
    "255.255.255.224": "/27",
    "255.255.255.192": "/26",
    "255.255.255.128": "/25",
    "255.255.255.0": "/24",
    "255.255.254.0": "/23",
    "255.255.252.0": "/22",
    "255.255.248.0": "/21",
    "255.255.240.0": "/20",
    "255.255.224.0": "/19",
    "255.255.192.0": "/18",
    "255.255.128.0": "/17",
    "255.255.0.0": "/16",
};

export default async function ({cb,single}) {
       const server = dgram.createSocket('udp4'),
        surfaces = [],
        found = [],
        buffmessage = new Buffer(config.packetPing, "hex"),
        netInfo = await getNetInfo();
    if(single)
        netInfo.broadcastIP = single;

    await new Promise(resolve => {
        server.bind(config.port+1, netInfo.ip, function () {
            resolve();
        });
    });

    server.setBroadcast(true);
    server.on('message', function (messagein, {address : ip_address}) {
        //console.log(messagein.toString('hex'))
        const messagehex = new Buffer(messagein).toString('hex'),
            msg = messagehex.substring(0, 8),
            id = messagehex.substring(48, 60);
        //console.log(id)


        if (msg == config.packetAnswer && !found.includes(id)) {

            if (!found.includes(ip_address)) {
                surfaces.push({id, ip_address});
                found.push(ip_address)

                if(cb)
                    cb({id,ip_address});
            }
        }
    });
    server.send(buffmessage, 0, buffmessage.length, config.port, netInfo.broadcastIP);
    const sendping = setInterval(
        () => {
            server.send(buffmessage, 0, buffmessage.length, config.port, netInfo.broadcastIP);
        },
        config.delay
    );

    await wait(config.timeout);
    clearInterval(sendping);
    server.close();
    return surfaces
}


function wait(time, value, fail) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (fail === 'fail') {
                reject(value);
            } else {
                resolve(value);
            }
        }, time)
    });
}


function getNetInfo() {
    return new Promise((resolve, reject) => {
        "use strict";
        try {
            network.get_active_interface(function (err, list) {
                //console.log(list)


                if(list){
                    resolve({
                        ip: list.ip_address,
                        broadcastIP : Addr(list.ip_address + subNetTable[list.netmask]).broadcast().octets.join('.')
                    })
                }

                //  const broadcastIP = Addr(list.ip_address + subNetTable[list.netmask]).broadcast().octets.join('.')
                const broadcastIP = '192.168.0.1'
                resolve({
                    // ip: list.ip_address,
                    ip: '192.168.0.153',
                    broadcastIP

                })
            })
        } catch (e) {
            reject(e)
        }
    })
}


