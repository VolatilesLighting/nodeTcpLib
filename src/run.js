import tcp from './lib/com/surfaceCom/tcpsend';

const v = {
    play_scene: {
        scene_id: 25,
        //speed : 10,
        //brightness: 50,
        //color_temperature: 700,
        //color:[0,0,255,0],
        // set_overlay:0
    }
}
tt1('192.168.1.239', v)


function tt1(ip, v) {
    //console.log('go')
    //tcp('192.168.2.160', {get_pub_info: null}, false, '', {}, {
    // tcp('192.168.2.164', {get_surface_info: null}, false, '', {}, {
    // tcp('192.168.2.159', {set_overlay: null}, false, '', {}, {
    tcp(ip, v, false, '', {}, {
        //tcp(ip, {get_installed_scenes: null}, false, '', {}, {
        //tcp('192.168.2.160', {get_pub_info: null}, false, 'master', {}, {
        "decryptionRetrys": 3,
        "timeout": 5000,
        "retrys": 50,
        "delay": 500,
        log: false
    }, null).then(data => {

        //console.log(data)
        "use strict";
        if (!Array.isArray(data) || !data.length) {
            console.log(data);
            return;
        }

        data.forEach(d => {
            // console.log('./cli.sh 192.168.2.160 rm '+d+'.scn')
            console.log(d)
        });
        //   return
        //  data.forEach(d =>{

        //console.log(d,d.adler32,d)
        //})
    }).catch(e => {
        console.log(e)
    })
}