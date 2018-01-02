/**
 * Created by flomair on 21.03.17.
 */
import c2c from './surfaceCall2Cmd';

describe('surfaceCall2Cmd', function () {

    it('should return object  with get_surface_info', () => {
        expect(c2c.get_surface_info()).toEqual({cmd: 'get_surface_info', params: 'null'});
    });
    it('should return object  with get_WiFi', () => {
        expect(c2c.get_WiFi()).toEqual({cmd: 'get_WiFi', params: 'null'});
    });
    it('should return object  with get_allowed_operations', () => {
        expect(c2c.get_allowed_operations()).toEqual({cmd: 'get_allowed_operations', params: 'null'});
    });
    it('should return object  with set_allowed_operations', () => {
        const param = {
            change_brightness: 1,
            change_color: 2,
            change_scene: 3,
            change_speed: 4,
            standby: 4
        };
        expect(c2c.set_allowed_operations(param)).toEqual({cmd: 'set_allowed_operations', params: param});
    });
    it('should return object  with get_settings', () => {
        expect(c2c.get_settings()).toEqual({cmd: 'get_settings', params: 'null'});
    });
    it('should return object  with set_settings', () => {
        const param = {
            ambient_sensor: 1,
            touch_sensor: 2,
            proximity_sensor: 3
        };
        expect(c2c.set_settings(param)).toEqual({cmd: 'set_settings', params: param});
    });
    it('should return object  with set_adapter', () => {
        const param = {
            ssid: 1,
            password: 2,
        };
        expect(c2c.set_adapter(param)).toEqual({cmd: 'set_adapter', params: param});
    });
    it('should return object  with get_surface_name', () => {
        expect(c2c.get_surface_name()).toEqual({cmd: 'get_surface_name', params: 'null'});
    });
    it('should return object  with set_surface_name', () => {
        const param = "susi";
        expect(c2c.set_surface_name(param)).toEqual({cmd: 'set_surface_name', params: param});
    });

    it('should return object  with get_diagnostics', () => {
        expect(c2c.get_diagnostics()).toEqual({cmd: 'get_diagnostics', params: 'null'});
    });

    it('should return object  with reset_surface', () => {
        expect(c2c.reset_surface()).toEqual({cmd: 'reset_surface', params: 'null'});
    });

    it('should return object  with blink_identify', () => {
        expect(c2c.blink_identify()).toEqual({cmd: 'blink_identify', params: 'null'});
    });

    it('should return object  with get_sec_mode', () => {
        expect(c2c.get_sec_mode()).toEqual({cmd: 'get_sec_mode', params: 'null'});
    });
    it('should return object  with get_scene_parameters', () => {
        expect(c2c.get_scene_parameters()).toEqual({cmd: 'get_scene_parameters', params: 'null'});
    });

    it('should return object  with set_speed', () => {
        const param = 5;
        expect(c2c.set_speed(param)).toEqual({cmd: 'set_speed', params: param});
    });
    it('should return object  with set_brightness', () => {
        const param = 5;
        expect(c2c.set_brightness(param)).toEqual({cmd: 'set_brightness', params: param});
    });
    it('should return object  with set_color', () => {
        const param = [1,2,3,4];
        expect(c2c.set_color(param)).toEqual({cmd: 'set_color', params: param});
    });
    it('should return object  with set_color_temperature', () => {
        const param = 5;
        expect(c2c.set_color_temperature(param)).toEqual({cmd: 'set_color_temperature', params: param});
    });

    it('should return object  with get_installed_scenes', () => {
        expect(c2c.get_installed_scenes()).toEqual({cmd: 'get_installed_scenes', params: 'null'});
    });

    it('should return object  with firmware_update', () => {
        const param = {
            file: 'file',
            filename: "filename",
        };
        expect(c2c.firmware_update(param)).toEqual({cmd: 'firmware_update', params: param});
    });

    it('should return object  with scene_install', () => {
        const param = {
            file: 'file',
            scene_id: 1,
        };
        expect(c2c.scene_install(param)).toEqual({cmd: 'scene_install', params: param});
    });

    it('should return object  with play_scene', () => {
        const param = 5;
        expect(c2c.play_scene(param)).toEqual({cmd: 'play_scene', params: param});
    });


    it('should return object  with set_standby', () => {
        const param = 'susi';
        expect(c2c.set_standby(param)).toEqual({cmd: 'set_standby', params: param});
    });

    it('should return object  with request_vis_key', () => {
        expect(c2c.request_vis_key()).toEqual({cmd: 'request_vis_key', params: 'null'});
    });

    it('should return object  with check_touch', () => {
        expect(c2c.check_touch()).toEqual({cmd: 'check_touch', params: 'null'});
    });
    it('should return object  with check_key', () => {
        expect(c2c.check_key()).toEqual({cmd: 'check_key', params: 'null'});
    });

    it('should return object  with set_sec_mode', () => {
        const param = "secmode";
        expect(c2c.set_sec_mode(param)).toEqual({cmd: 'set_sec_mode', params: param});
    });


    it('should return object  with get_serial_number', () => {
        expect(c2c.get_serial_number()).toEqual({cmd: 'get_serial_number', params: 'null'});
    });







});