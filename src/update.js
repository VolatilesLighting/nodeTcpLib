import path from 'path'
import tcpsend from './lib/com/surfaceCom/tcpSend';

import uploadToSurface from "./lib/com/surfaceCom/uploadToSurface";


let rainbow;


export default async({firmware,ip,mac,masterKey}) =>{
//const pp = async({firmware,ip,mac,masterKey}) =>{

    if (mac && !ip)
        ip = await getSurface(mac);

    if(!ip)
        throw 'ip or mac address must be provided';
    if(!masterKey)
        throw 'masterKey must be provided';
    if(!firmware)
        throw 'firmware must be provided';
    try {
        await  uploadToSurface({
            filename:  path.join(process.cwd(), firmware),
            type: 'firmware',
            ip,
            key: masterKey,
            cb: logger(ip),
        })
       const newVersion =  await  getFirmwareVersion({ip_address: ip,key:masterKey,})
        console.log(`Updated to ${newVersion}`);
        return
    }catch (e){
        console.log(e)
    }
}

//pp({firmware:'8',ip:'192.168.2.161',masterKey:'10a58869d74be5a374cf867cfb473859'}).catch(e => console.log(e))



async function getFirmwareVersion(surface) {
    try {
        const res = await tcpsend(surface.ip_address, {get_surface_info: null}, surface.key, 'master', {}, {log:false,timeout: 5000, retrys:50})
        //console.log(res)
        return res.firmware_version
    }
    catch (e) {
        console.log(e)
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(getFirmwareVersion(surface));
            }, 1000)
        })
    }
}

function logger(ip) {

    return (err, length, i) => {
        if (err) {
            console.log('error', ip, err)
            return
        }

        if(i === length-1){
            console.log('Installing....')
            return
        }

        console.log(`${ip} => ${i + 2}/${length} ${Math.ceil((i + 2) * 100 / length)}%`)
    }
}