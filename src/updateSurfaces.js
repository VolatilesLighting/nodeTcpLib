

import path from 'path'
import discoverSurfaces from './lib/com/surfaceCom/discoverSurfaces'
import updateFirmware from './lib/com/surfaceCom/updateFirmware'





export default async function () {
    try {
        const list = await discoverSurfaces({cb:listUpdate})
        list.forEach(surface => {

                 doUpdate(surface.ip_address)
              })
    }catch (e){
        console.log(e)
    }
}

function listUpdate(list){
    "use strict";
    console.log(list)
   //

}

doUpdate('192.168.2.161','10a58869d74be5a374cf867cfb473859','./3')
//doUpdate('192.168.2.218','F96E1A77B581105767CFBBC2DAF06D5D')


function doUpdate(ip, key, file) {
    const nf = path.join(process.cwd(), file)
   // console.log(nf)

    const loggerIn = logger(ip)
    return updateFirmware(ip, key ,nf, loggerIn)
        .then(versionDet =>
            console.log(`\n${ip} => Update Successful @ ${versionDet}`))
        .catch(e => console.log('e', JSON.stringify(e,null,2)))
}


function logger(ip) {
    return (err, length, i) => {
        if (err) {
            console.log('error', ip, err)
            return
        }
        console.log(`${ip} => ${i + 1}/${length} ${Math.ceil((i + 1) * 100 / length)}%`)
    }

}




