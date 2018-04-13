import tcp from './lib/com/surfaceCom/tcpsend';

const v = {
    play_scene: {
        scene_id: 15,
        //speed : 10,
        //brightness: 50,
        //color_temperature: 700,
        //color:[0,0,255,0],
        // set_overlay:0
    }
}
const v2 = {
    play_scene: {
        scene_id: 25,
        //speed : 10,
        //brightness: 50,
        //color_temperature: 700,
        //color:[0,0,255,0],
        // set_overlay:0
    }
}




tt1('192.168.2.160', v)
tt1('192.168.2.160', v2)


function tt1(ip, v) {
    console.log('go')
    //tcp(ip, {set_surface_name_hex: Buffer('太阳').toString('hex')}, 'D31F761B862DA2CB5369832C87BB1BA5', 'master', {}, {
    tcp(ip, v, false, 'master', {}, {
  // tcp(ip, {get_surface_name: null}, 'D31F761B862DA2CB5369832C87BB1BA5', 'master', {}, {
    //tcp(ip, v, '', '', {}, {
    //tcp('192.168.2.116', {get_pub_info: null}, '10a58869d74be5a374cf867cfb473859', 'master', {}, {
    // tcp('192.168.2.164', {get_surface_info: null}, false, '', {}, {
    // tcp('192.168.2.159', {set_overlay: null}, false, '', {}, {
    //tcp(ip, v, false, '', {}, {
        //tcp(ip, {get_installed_scenes: null}, false, '', {}, {
        //tcp('192.168.2.160', {get_pub_info: null}, false, 'master', {}, {
        "decryptionRetrys": 3,
        "timeout": 2000,
        "retrys": 10,
        "delay": 200,
        log: false
    }, null).then(data => {

        //console.log(data)
        "use strict";
        if (!Array.isArray(data) || !data.length) {
            console.log(data);
            tt1(ip,v)
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
        tt1(ip,v)
    }).catch(e => {
        console.log('err:',e)
    })
}