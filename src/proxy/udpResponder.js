import dgram from 'dgram';
import {udp as config} from '../lib/com/config'

export default function ({newMac,localIP}) {
    const server = dgram.createSocket('udp4'),
        responsePre = `000000f70000050159310000000000000000000000000000${newMac}`,
        response = new Buffer(responsePre, "hex");
    //  console.log(responsePre)
    // console.log(response)


    server.on('error', (err) => {
        console.log(`server error:\n${err.stack}`);
        server.close();
    });

    server.on('message', (messagein, rinfo) => {
        const msgin = new Buffer(messagein).toString('hex').substring(0, 8);
        if (msgin !== config.packetPing || rinfo.address === localIP)
            return;




        server.send(response, rinfo.port, rinfo.address, (err) => {
            if (err)
                console.log(err);
        });

    });

    server.on('listening', () => {
        const address = server.address();
        //  console.log(`server listening ${address.address}:${address.port}`);
    });

    server.bind(config.port);
}



