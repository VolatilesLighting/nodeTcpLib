import {discover} from './discoverSurfaces';
import {proxy} from './proxy/index.js';
import {send} from './tcp.js';
import {play} from './play.js';
import {tcpconfig} from './lib/com/config';

require('yargs')

    .command('find [details]', 'find surfaces in wifi', (yargs) => {
    yargs
        .positional('details', {
            describe: 'show details',
            default: false
        })

    }, (argv) => {
        discover(argv.details).catch(e => console.log(e))
    })
    .command('proxy [mac] [masterKey] [visitorKey]', 'creat proxy for logging', (yargs) => {
    yargs
        .positional('mac', {
            alias: 'm',
            describe: 'mac address of surface, eg. 0080....',
            default: false
        })
        .positional('masterKey', {
            alias: 'mk',
            describe: 'master key of surface if master port should be mocked',
            default: false
        })
        .positional('visitorKey', {
            alias: 'vk',
            describe: 'visitor key of surface if visitor port should be mocked',
            
        })
    }, (argv) => {
      //  console.log(argv)
        proxy(argv).catch(e => console.log(e))
    })
    .command('replay [file] [config] [mac] [ip] [masterKey] [visitorKey]', 'replay logged requests', (yargs) => {
        yargs
            .positional('file', {

                describe: 'recorded requests to be replayed eg. from reqs.log',
                default: 'reqs.log',
                type: 'string'
            })
            .positional('config', {
                alias: 'c',
                describe: 'configuration as json or path of configuration as file.\n default values are: \n'+ JSON.stringify(tcpconfig.settings,null,2),
                default: {}
            })
            .positional('mac', {

                describe: 'mac address',
              default: false
            })
            .positional('ip', {

                describe: 'ip address',
                default: false
            })
            .positional('masterKey', {
                alias: 'mk',
                describe: 'master key of surface',
                default: false
             
            })
            .positional('visitorKey', {
                alias: 'vk',
                describe: 'visitor key of surface',
                default: false
    
            })
    }, (argv) => {
         //console.log(argv)
        argv.config = objifier(argv.config|| {});
       // const params = {...argv,config:objifier(argv.config)|| {}}
        play(argv).catch(e => console.log(e))
    })
    .command('send [ip] [command] [settings] [key] [keytype]', 'send tcp command', (yargs) => {
        yargs
            .positional('ip', {
                alias: 'i',
                describe: 'ip to send to',
            })
            .positional('command', {
                alias: 'c',
                describe: 'command to send ',
                default: {get_pub_info: null}
            })
            .positional('settings', {
                alias: 's',
                describe: 'settings to send ',
                default: '{}'
            }).positional('key', {
            alias: 'k',
                describe: 'key to send ',
                default: false
        })
            .positional('keyType', {
                alias: 'kt',
                describe: 'key to send ',
                default: ''
            })
            .positional('data', {
                alias: 'd',
                describe: 'data to send ',
                default: null
            })
    }, (argv) => {

        send(argv.ip, objifier(argv.command), argv.key, argv.keyType, {}, objifier(argv.settings), argv.data)
       // send(argv.ip, JSON.parse('"' + argv.command + '"'), argv.key, argv.keyType, {}, JSON.parse('"' + argv.settings + '"'), argv.data)
        //send(argv.ip, {get_pub_info:null}, argv.key, argv.keyType, {}, {log:true}, argv.data)
         //send(argv.ip, JSON.parse(JSON.stringify(argv.command)), argv.key, argv.keyType, {}, {log:true}, argv.data)

    }).argv



function objifier(objStr){
    try {
        if (!objStr.includes('{'))
            return objStr;
        let p
        eval('p = JSON.stringify(' + objStr + ')')
        return JSON.parse(p)
    }catch (e){
        return objStr
    }
}