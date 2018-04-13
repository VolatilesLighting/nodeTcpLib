var qrcode = require('qrcode-terminal')


//const id = '0080a3a0fc51', key = '10a58869d74be5a374cf867cfb473859', wifiPassword = 'XPICOWIFI';
//makeQr({id, key, wifiPassword})

export default function makeQr({mac, key, wifiPassword, keyType}) {
    console.log(`\nQR for ${mac}\n`)
    qrcode.generate(`volatiles://v/s${mac},${wifiPassword}|${keyType || 'm'}${key}`);
    console.log(`\n\n\n`)
}

