import vola from './tcp';


function logger(r) {
    console.log('r',r)
}
//upl()
//tcp()

function tcp() {
    vola.tcp({
        ip: '192.168.2.164',
        cmd: 'get_sec_mode',
        key: '10a58869d74be5a374cf867cfb473859',
        keyType: 'master',
        settings: {timeout: 2000, log: true}
    })
        .then(r => console.log(r))
        .catch(r => console.log(r))
}
function upl() {
    vola.uploadToSurface({
        filename: './playground/15',
        type: 'scene',
        key: '10a58869d74be5a374cf867cfb473859',
        ip: '192.168.2.164',
       // cb: logger
    })
        .then(r => console.log(r))
        .catch(r => console.log(r))
}
function disc() {
    vola.discoverSurfaces('192.168.1.255')
        .then(r => console.log(r))
        .catch(r => console.log(r))
}