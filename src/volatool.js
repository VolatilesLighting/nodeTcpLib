import yargs from 'yargs';
import {discover} from './discoverSurfaces';
import {send} from './tcp.js';


require('yargs') // eslint-disable-line
    .command('find', 'find surfaces in wifi', (yargs) => {
    yargs
        .positional('details', {
            describe: 'show details',
            default: false
        })
    }, (argv) => {
        discover(argv.details).catch(e => console.log(e))
    })
    .command('send [ip] [command] [settings] [key] [keytype]', 'send tcp command', (yargs) => {
        yargs
            .positional('ip', {
                describe: 'ip to send to',
            })
            .positional('command', {
                describe: 'command to send ',
                default: {get_pub_info: null}
            })
            .positional('settings', {
                describe: 'settings to send ',
                default: '{}'
            }).positional('key', {
                describe: 'key to send ',
                default: false
        })
            .positional('keyType', {
                describe: 'key to send ',
                default: ''
            })
            .positional('data', {
                describe: 'data to send ',
                default: null
            })
    }, (argv) => {

        send(argv.ip, objifier(argv.command), argv.key, argv.keyType, {}, objifier(argv.settings), argv.data)
       // send(argv.ip, JSON.parse('"' + argv.command + '"'), argv.key, argv.keyType, {}, JSON.parse('"' + argv.settings + '"'), argv.data)
        //send(argv.ip, {get_pub_info:null}, argv.key, argv.keyType, {}, {log:true}, argv.data)
         //send(argv.ip, JSON.parse(JSON.stringify(argv.command)), argv.key, argv.keyType, {}, {log:true}, argv.data)

    })



    .argv



function objifier(objStr){
    let p
    eval('p = JSON.stringify('+objStr+')')
    return JSON.parse(p)
}