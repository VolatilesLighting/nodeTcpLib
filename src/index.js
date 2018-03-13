import tcp from './lib/com/surfaceCom/manageTCP';
import surfaceCall2Cmd from './lib/com/surfaceCom/surfaceCall2Cmd';
import discoverSurfacesPre from './lib/com/surfaceCom/discoverSurfaces';
import uploadToSurface from './lib/com/surfaceCom/uploadToSurface';





const publicFunctions =[
    'blink_identify',
    'get_sec_mode',
    'get_scene_parameters',
    'set_speed',
    'set_brightness',
    'set_color',
    'set_color_temperature',
    'get_surface_name',
    'get_installed_scenes',
    'scene_install',
    'play_scene',
    'set_standby',
    'check_key',
];



function discoverSurfaces(ip){
    return discoverSurfacesPre({cb:() =>{},single:ip})
}


async function makeTcp({mac,ip,cmd,val,key, keyType,settings,self}) {
    const resp = await  tcp({mac: mac || ip, ip, command: {...surfaceCall2Cmd[cmd](val),settings},key, keyType,self});
    if(mac)
        return resp;
    return resp.response
}

export default {
    discoverSurfaces : discoverSurfacesPre,
    tcp : makeTcp,
    publicFunctions,
    uploadToSurface
}