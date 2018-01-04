'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeTcp = exports.publicFunctions = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var makeTcp = exports.makeTcp = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
        var mac = _ref2.mac,
            ip = _ref2.ip,
            cmd = _ref2.cmd,
            val = _ref2.val,
            key = _ref2.key,
            keyType = _ref2.keyType,
            settings = _ref2.settings,
            self = _ref2.self;
        var resp;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return (0, _manageTCP2.default)({ mac: mac || ip, ip: ip, command: _extends({}, _surfaceCall2Cmd2.default[cmd](val), { settings: settings }), key: key, keyType: keyType, self: self });

                    case 2:
                        resp = _context.sent;

                        if (!mac) {
                            _context.next = 5;
                            break;
                        }

                        return _context.abrupt('return', resp);

                    case 5:
                        return _context.abrupt('return', resp.response);

                    case 6:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function makeTcp(_x) {
        return _ref.apply(this, arguments);
    };
}();

exports.discoverSurfaces = discoverSurfaces;

var _manageTCP = require('../lib/com/surfaceCom/manageTCP');

var _manageTCP2 = _interopRequireDefault(_manageTCP);

var _surfaceCall2Cmd = require('../lib/com/surfaceCom/surfaceCall2Cmd');

var _surfaceCall2Cmd2 = _interopRequireDefault(_surfaceCall2Cmd);

var _discoverSurfaces = require('../lib/com/surfaceCom/discoverSurfaces');

var _discoverSurfaces2 = _interopRequireDefault(_discoverSurfaces);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } //import "babel-polyfill";


makeTcp({ ip: '192.168.2.166', cmd: 'get_allowed_operations', settings: { timeout: 20 } }).then(function (r) {
    return console.log(r);
}).catch(function (r) {
    return console.log(r);
});

var publicFunctions = exports.publicFunctions = ['blink_identify', 'get_sec_mode', 'get_scene_parameters', 'set_speed', 'set_brightness', 'set_color', 'set_color_temperature', 'get_surface_name', 'get_installed_scenes', 'scene_install', 'play_scene', 'set_standby', 'check_key'];

function discoverSurfaces() {
    return (0, _discoverSurfaces2.default)(function () {});
}

