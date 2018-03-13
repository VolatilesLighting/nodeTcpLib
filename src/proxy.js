

import aes from './lib/encrypt/aes';
import net from 'net';
import {tcpconfig as config} from './lib/com/config'


console.log(config)
function setUpProxy({key,type}){
   const server = net.createServer((c) => {
        // 'connection' listener
        console.log('client connected');
        c.on('end', () => {
            console.log('client disconnected');
        });
        c.write('hello\r\n');
        c.pipe(c);
    });

    server.on('error', (err) => {
        throw err;
    });

    server.listen(config.ports[type]);
    return server
}