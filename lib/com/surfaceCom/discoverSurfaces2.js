import dgram from 'react-native-udpsocket';
//import dgram from 'dgram';
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
    const server = dgram.createSocket('udp4'),
        found = [],
        buffmessage = new Buffer(config.packetPing, "hex"),
        netInfo = await getNetinfo();

    setSSid(netInfo.ssid);

    let hasUdpError = true;
    await new Promise(resolve => {
        server.bind(config.port, netInfo.ip, function () {
            resolve();
        });
    });


        server.setBroadcast(true);

    server.on('message', function (messagein, {address : ip_address}) {
        const messagehex = new Buffer(messagein).toString('hex'),
            msg = messagehex.substring(0, 8),
            id = messagehex.substring(48, 60);

        if (msg == config.packetAnswer && !found.includes(id)) {
            if(log)
                console.log({id, ip_address, ssid: netInfo.ssid})
            found.push(id);
            const surface = surfaces.find(sf => {
                return sf.id === id
            });
            if (surface) {
                if (surface.ip_address != ip_address)
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

    wait(config.timeout)
    clearInterval(sendping);
    server.close();
}

const getNetinfo = async() => {
    let netInfo = await networkInfo.all();

    netInfo = {
        ssid: netInfo[0],
        ip: netInfo[1],
        broadcastIP: netInfo[2],
    };

    if (__DEV__ && netInfo.ip === null){
        netInfo = {
            ssid: netInfoDEV[0],
            ip: netInfoDEV[1],
            broadcastIP: netInfoDEV[2],
        };
    }
    return netInfo
}