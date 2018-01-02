//import dgram from 'react-native-udp';
import dgram from './udp';
import networkInfo from 'react-native-network-info';
import {Buffer} from 'buffer';
import wait from  '../../helpers/wait';
import {udp as config} from '../config';

//"react-native-udp": "https://github.com/flomair/react-native-udp/tarball/master",
const netInfoDEV =
    [
        "VOLASYSTEMS",
        "0.0.0.0",
        "192.168.1.255"
    ];


export default async({setSSid, surfaces, updateSurface, initSurface, log = false}) => {
    try {
        const server = dgram.createSocket('udp4'),
            found = [],
            buffmessage = new Buffer(config.packetPing, "hex"),
            netInfo = await getNetinfo();

        server._debug = (...args) => {
            if (log)
                console.log('debug', this._id, args.join(' '))
        };

        setSSid(netInfo.ssid);

        let hasUdpError = true;
        await new Promise(resolve => {

            server.bind(config.port, function (err) {
                if(err)
                    throw err;
                resolve();
            });
        });


        server.setBroadcast(true);

        server.on('message', function (messagein, {address : ip_address}) {

            const messagehex = new Buffer(messagein).toString('hex'),
                msg = messagehex.substring(0, 8),
                id = messagehex.substring(48, 60);
            //console.log(messagehex,Buffer(messagein).toString('utf8'))

            if (msg == config.packetAnswer && !found.includes(id)) {
                if (log)
                    console.log({id, ip_address, ssid: netInfo.ssid});
                found.push(id);
                const surface = surfaces.find(sf => {
                    return sf.id === id
                });
                if (surface) {
                    if (!surface.connected || surface.ip_address != ip_address)
                        updateSurface({id, ip_address, ssid: netInfo.ssid});
                } else {
                    initSurface({id, ip_address, ssid: netInfo.ssid});
                }
            }
            if (msg === config.packetPing || found.length) {
                hasUdpError = false;
            }
        });
        server.send(buffmessage, 0, buffmessage.length, config.port, netInfo.broadcastIP);
        const sendping = setInterval(
            () => {
                server.send(buffmessage, 0, buffmessage.length, config.port, netInfo.broadcastIP);
            },
            config.delay
        );

        await wait(config.timeout)
        clearInterval(sendping);
        server.close();
    }catch (e){
        console.log(e)
    }
}

const getNetinfo = async() => {
    let netInfo = await networkInfo.all();

    netInfo = {
        ssid: netInfo[0],
        ip: netInfo[1],
        broadcastIP: netInfo[2],
    };

    if (__DEV__ && netInfo.ip === null) {
        netInfo = {
            ssid: netInfoDEV[0],
            ip: netInfoDEV[1],
            broadcastIP: netInfoDEV[2],
        };

    }
    if(netInfo.ssid === 'error'){
        netInfo.ssid = netInfoDEV[0]
    }
    //console.log(netInfo)
    return netInfo
}