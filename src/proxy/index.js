import discoverSurfaces from "../lib/com/surfaceCom/discoverSurfaces";
import udpResponder from './udpResponder'
import tcpRelay from './tcpRelay'
import {Addr} from "netaddr";
import network from "network";

//console.log(config)






export  const  proxy = async({mac,masterKey,visitorKey}) => {
    //console.log({mac,master,visitor})
    try{

        const remoteIP = await getSurface(mac),
            newMac = '5555' + mac.slice(4),
            localIP = getNetInfo();

        await tcpRelay({remoteIP,masterKey,visitorKey})
       udpResponder({newMac,localIP})

    }catch (e){
        console.log(e)
    }
}

//setUp({mac: '0080a3a0fc51',master:'10a58869d74be5a374cf867cfb473859'}).catch(r=> console.log('e',r))



//function

 function getSurface(mac) {
    return new Promise(resolve => {
        const cb = ({id,ip_address}) =>
        {
            if(id === mac)
                resolve(ip_address)
        };
        discoverSurfaces({cb})
    })
}

function getNetInfo() {
    return new Promise((resolve, reject) => {
        "use strict";
        try {
            network.get_active_interface(function (err, list) {
                if(list){
                    resolve(list.ip_address)
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}