import {Buffer} from 'buffer'
export default  {


    /**
     *
     */
    get_surface_info: (): Object => {
        return {cmd: 'get_surface_info', params: 'null'}
    },

    get_WiFi: (): Object => {
        return {cmd: 'get_WiFi', params: 'null'}
    }
    ,
    get_allowed_operations: (): Object => {
        return {cmd: 'get_allowed_operations', params: 'null'}
    }
    ,
    set_allowed_operations: ({change_brightness, change_color, change_scene, change_speed, standby}: Object): Object => {
        return {
            cmd: 'set_allowed_operations',
            params: {change_brightness, change_color, change_scene, change_speed, standby}
        }
    },

    get_settings: (): Object => {
        return {cmd: 'get_settings', params: 'null'}
    },

    set_settings: ({ambient_sensor, touch_sensor, proximity_sensor} : Object): Object => {
        return {cmd: 'set_settings', params: {ambient_sensor, touch_sensor, proximity_sensor}}
    },
    set_adapter2: ({ssid, password} : Object): Object => {
        return {cmd: 'set_adapter', params: {ssid, pw:password}}
    },
    set_adapter: ({ssid, password} : Object): Object => {
        return {cmd: 'set_adapter_hex', params: {ssid:toHex(ssid), pw:toHex(password)}}
    },

    get_surface_name: (): Object => {
        return {cmd: 'get_surface_name', params: 'null'}
    },

    set_surface_name2: (name : String): Object => {
        return {cmd: 'set_surface_name', params: name}
    },
    set_surface_name: (name : String): Object => {
        return {cmd: 'set_surface_name_hex', params: toHex(name)}
    },
    get_diagnostics: (): Object => {
        return {cmd: 'get_diagnostics', params: 'null'}
    },
    reset_surface: (): Object => {
        return {cmd: 'reset_surface', params: 'null'}
    },
    blink_identify: (): Object => {
        return {cmd: 'blink_identify', params: 'null'}
    },
    get_sec_mode: (): Object => {
        return {cmd: 'get_sec_mode', params: 'null'}
    },
    get_scene_parameters: (): Object => {
        return {cmd: 'get_scene_parameters', params: 'null'}
    },

    set_speed: (speed :Number): Object => {
        return {cmd: 'set_speed', params: speed}
    },

    set_brightness: (brightness :Number): Object => {
        return {cmd: 'set_brightness', params: brightness}
    },
    set_color: (color :Number[]): Object => {
        return {cmd: 'set_color', params: color}
    },
    set_color_temperature: (temperature :Number): Object => {
        return {cmd: 'set_color_temperature', params: temperature}
    },

    get_installed_scenes: (): Object => {
        return {cmd: 'get_installed_scenes', params: 'null'}
    },

    firmware_update: ({file, filename} : Object): Object => {
        return {cmd: 'firmware_update', params: {file,filename}}
    },

    scene_install: ({scene_id,file} : Object): Object => {
        return {cmd: 'scene_install', params: {scene_id, file}}
    },

    play_scene: (sceneParams :Object): Object => {
        if(!isNaN(parseFloat(sceneParams)) && isFinite(sceneParams))
            sceneParams = {'scene_id':sceneParams};
        return {cmd: 'play_scene', params: sceneParams}
    },

    play_playlist: (params :Object): Object => {
        return {cmd: 'play_playlist', params: params}
    },

    set_playlist_next: (params :Object): Object => {
        return {cmd: 'set_playlist_next', params: params}
    },

    set_playlist_prev: (params :Object): Object => {
        return {cmd: 'set_playlist_prev', params: params}
    },

    set_playlist_order: (params :Object): Object => {
        return {cmd: 'set_playlist_order', params: params}
    },

    set_standby: (standby :Boolean): Object => {
        return {cmd: 'set_standby', params: standby}
    },

    request_vis_key: (): Object => {
        return {cmd: 'request_vis_key', params: 'null'}
    },

    get_vis_key: (): Object => {
        return {cmd: 'request_vis_key', params: 'null'}
    },

    set_vis_key: (key): Object => {
        return {cmd: 'set_vis_key', params: key}
    },

    check_touch: (): Object => {
        return {cmd: 'check_touch', params: 'null'}
    },

    check_key: (): Object => {
        return {cmd: 'check_key', params: 'null'}
    },

    set_sec_mode: (secmode: string): Object => {
        return {cmd: 'set_sec_mode', params: secmode}
    },

    get_serial_number: (): Object => {
        return {cmd: 'get_serial_number', params: 'null'}
    },

    get_pub_info: (): Object => {
        return {cmd: 'get_pub_info', params: 'null'}
    },


}

function toHex(string){
    return Buffer(string).toString('hex')
}