export default [
    {
        name: 'intObject',
        properties: {id: 'int'}
    },
    {
        name: 'stringObject',
        properties: {id: 'string'}
    },
    {
        name: 'currentActive',
        primaryKey: 'id',
        properties: {
            type: 'string',
            id: 'string',
            ssid: 'string',
            surfaces: {type: 'list', objectType: 'stringObject'},
        }
    },
    {
        name: 'groups',
        primaryKey: 'id',
        properties: {
            name: {type: 'string', indexed: true},
            id: {type: 'string', indexed: true},
            surfaces: {type: 'list', objectType: 'stringObject'},
        }
    },
    {
        name: 'surfaces',
        primaryKey: 'id',
        properties: {
            name: {type: 'string', default: ''},
            id: {type: 'string', indexed: true},
            firmware_version: {type: 'string', default: ''},
            surface_runtime: {type: 'int', default: 0},
            number_tiles: {type: 'int', default: 0},
            width_tiles: {type: 'int', default: 0},
            height_tiles: {type: 'int', default: 0},
            power_on: {type: 'bool', default: false},
            playing_scene_id: {type: 'int', default: 0},
            connected: {type: 'bool', default: false},
            uptodate: {type: 'bool', default: false},
            last_access_role: {type: 'string', default: ''},
            ip_address: {type: 'string', default: ''},
            ssid: {type: 'string', default: ''},
            currentActive: {type: 'bool', default: false},
            sec_mode: {type: 'string', default: 'locked'},
            //allowed_operations: {type: 'allowed_operationsObject'},
            //scene_parameters: {type: 'scene_parametersObject'}
        }
    },
    {
        name: 'categories',
        primaryKey: 'name',
        properties: {
            name: 'string',
            id: {type: 'int', indexed: true},
            scenes: {type: 'list', objectType: 'intObject'},
            category_image_url: 'string',
        }
    },
    {
        name: 'scenes',
        primaryKey: 'id',
        properties: {
            name: 'string',
            id: {type: 'int', indexed: true},
            autor: 'string',
            category: {type: 'string', indexed: true},
            categoryID: 'int',
            tags: {type: 'list', objectType: 'stringObject'},
            can_change_color: 'bool',
            can_change_color_temperature: 'bool',
            can_change_speed: 'bool',
            scene_image_url: 'string',
            file: {type: 'string', optional: true},
            played: {type: 'int', default: 0},
        }
    },
    {
        name: 'sceneConfig',
        primaryKey: 'id',
        properties: {
            id: {type: 'string', indexed: true},
            color: {type: 'string', optional: true},
            color_temperature: {type: 'int', optional: true},
            brightness: {type: 'int', optional: true},
            speed: {type: 'int', optional: true},
        }
    },
    {
        name: 'customScenes',
        primaryKey: 'id',
        properties: {
            id: {type: 'string', indexed: true},
            color: {type: 'string', optional: true},
            color_temperature: {type: 'string', optional: true},
            brightness: {type: 'string', optional: true},
            speed: {type: 'string', optional: true},
            scene: 'int',
        }
    },
    {
        name: 'firmware',
        primaryKey: 'versionNumber',
        properties: {
            versionNumber: 'string',
            user_info: 'string',
            file: 'string'
        }
    },
    {
        name: 'diagnostics',
        primaryKey: 'foreground',
        properties: {
            foreground: 'int',
            surface_errors: 'int',
            app_errors: 'int',
        }
    }, {
        "name": 'allowed_operationsObject',
        properties: {
            change_brightness: {type: 'bool', default: false},
            change_color: {type: 'bool', default: false},
            change_color_temperature: {type: 'bool', default: false},
            change_speed: {type: 'bool', default: false},
            change_scene: {type: 'bool', default: false},
            standby: {type: 'bool', default: false},
        }
    },
    {
        "name": "scene_parametersObject",
        properties: {
            speed: 'int',
            brightness: 'int',
            color: {type: 'list', objectType: 'intObject'},
            color_temperature: 'int'
        }
    },
    {
        "name": "permissions",
        primaryKey: 'name',
        properties: {
            name: 'string',
            allowed: {type: 'bool', default: false},
            asked: {type: 'bool', default: false},
        }
    },
    {
        "name": "help",
        primaryKey: 'id',
        properties: {
            id: 'int',
            scenes: {type: 'bool', default: true},
            auto: {type: 'bool', default: true},
            surfaces: {type: 'bool', default: true},
            user: {type: 'bool', default: false},
            surfaceAdd: {type: 'bool', default: false},
            surfaceConfig: {type: 'bool', default: false},
            surfaceShare: {type: 'bool', default: false},
            groupConfig: {type: 'bool', default: false},
            sceneConfig: {type: 'bool', default: true},
            surfaceUpdate: {type: 'bool', default: false},
            login: {type: 'bool', default: false},
            webview: {type: 'bool', default: false},
            help: {type: 'bool', default: false},
            surfaceClaim: {type: 'bool', default: false},
        }
    },
    {
        "name": "playlists",
        primaryKey: 'id',
        properties: {
            id: 'int',
            play_random: {type: 'bool', default: false},
            play_attributes: {type: 'play_attributes_object'},
            name: 'string',
            filename: 'string',
            list: {type: "play_list_object"}

        }
    }, {
        "name": "play_attributes_object",
        properties: {
            duration: 'int',
            speed: 'int',
            brightness: 'int',
            color: 'int',
            color_temperature: 'int',
        }
    },
    {
        "name": "play_list_object",
        properties: {
            scene_id: 'int',
            list: {type: "play_list_object"}
        }
    }
]

