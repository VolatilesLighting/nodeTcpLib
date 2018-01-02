import tcp from './manageTCP';
import surfaceCall2Cmd from './surfaceCall2Cmd';
import {getStore} from '../../../store';
import errHandler from './errHandler';
import bolify from '../../helpers/bolify';


const whiteList = ['set_speed', 'set_brightness', 'set_color', 'set_color_temperature', 'play_scene', 'set_standby','set_playlist_next','set_playlist_prev','set_playlist_order'];

export const runSingle = async(commandString, values, surface, settingsIn) =>{
    try {
        const resp = await runAll(commandString, values, [surface], settingsIn);
        return resp[0];
    }catch (e){
        if (Array.isArray(e)){
            throw (e[0])
        }
        throw e
    }
};

export const runAll = async(commandString, values, surfacesIN, settingsIn) => {
    let surfaces;
    if(Array.isArray(surfacesIN)){
        surfaces = surfacesIN;
    }else{
        surfaces = [surfacesIN];
    }

    return new Promise((resolve, reject) => {
        try {
            const command = surfaceCall2Cmd[commandString](values);
            if (settingsIn) {
                command.settings = {
                    ...command.settings,
                    ...settingsIn
                }
            }

            const cmds = surfaces.map(surface => {
                const cmd = {
                    mac: surface.id,
                    ip: surface.ip_address,
                    key: surface.key,
                    keyType: surface.keyType,
                    command
                };
                return tcp(cmd)
            });

            Promise.all(cmds)
                .then(resp => {
                    cmds.forEach(r => {
                        r.then(s =>{
                            errHandler.remmoveErr(s.mac)
                        })

                    });
                    if(commandString === 'get_pub_info'){
                        resp = resp.map(data =>{

                            if(data.response.surface_info){
                                data.response = {
                                    ...data.response,
                                    ...data.response.surface_info
                                };
                                delete data.response.surface_info
                            }
                            return data
                        })
                    }
                    //console.log(resp)
                    resolve(bolify(resp))
                })
                .catch(e => {
                    if(whiteList.includes(commandString)) {
                        cmds.map(s=>s).forEach(r => {
                            r.catch(er => {
                                errHandler.addErr(er.mac,tcp)
                            })
                        });

                    }
                    reject(e)
                })
        }catch (e){
            reject(e)
        }
    })
};

export const runActive = async(commandString, values, settingsIn) => {
    const store = getStore();
    const {surfaces, currentActive} = store.getState();
    if(!currentActive.surfaces || !currentActive.surfaces.length)
        return;
    const active = surfaces.filter(surface => currentActive.surfaces.includes(surface.id));
    if(!active.length) {
        const errs = currentActive.surfaces.map(s =>{
            return {err: CONSTS.messages.TCP_NO_CONNECTION,mac: s}

        })
        throw {err: CONSTS.messages.TCP_NO_CONNECTION};
    }
    return await runAll(commandString, values, active, settingsIn)
};


export const playscene = async(scene,check) => {
    if (!scene)
        return;
    let params;
    if(check){
         params = {scene_id: scene.id,adler32:scene.adler32};
    }else{
         params = {scene_id: scene.id};
    }

    //
    const store = getStore();
    const {surfaces, currentActive, sceneConfig} = store.getState();

    if(!currentActive.surfaces || !currentActive.surfaces.length)
        return;
    const active = surfaces.filter(surface => currentActive.surfaces.includes(surface.id));
    const commandString = 'play_scene';
    const thisConf = sceneConfig.find(conf => {
        return conf.id === `${scene.id}@${currentActive.id}`;
    });

    if (thisConf) {
        params = {
            ...params,
            ...thisConf
        }
    }

    //console.log(params);
    return await runAll(commandString, params, active,{log:false})
}




