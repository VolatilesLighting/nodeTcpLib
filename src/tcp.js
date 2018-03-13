import tcp from './lib/com/surfaceCom/tcpsend';


export function send(ip, message, key, keyType, done, settingsPre, data) {

    console.log(ip, message, key, keyType, done, settingsPre, data)
    tcp(ip, message, key, keyType, done, settingsPre, data).then(data => {
        if (!Array.isArray(data) || !data.length) {
            console.log(data);
            return;
        }
        data.forEach(d => {
            console.log(d)
        });
    }).catch(e => {
        console.log(e)
    })
}