/**
 * Created by flomair on 21.03.17.
 */
'use strict';
import Deferred from '../../helpers/deferred';
import tcpsend from './tcpSend';
const Promise = require('fbjs/lib/Promise.native');

const OBSOLETE = "OBSOLETE",
    CLEAR = "CLEAR",
    cues = {};

export default async({mac, ip, key, keyType, command, self} : Object) => {
    const logger = command.settings && command.settings.log;
    //const logger = true;
    const cue = getCue(ip);
    let response = 'nope',
        done = false;

    const prom = new Deferred();
    const tcpCall = prom.promise;
    //console.log(cue,ip)
    try {

        cue.push({ip, key, keyType, command, prom});

        if (cue.length === 1) {
            getNextLine(cue);
        }

        response = await tcpCall;
        if (response === OBSOLETE) {
            return {response: OBSOLETE, mac};
        }
        getNextLine(cue);
        if (logger)
            console.log(response)
        return {response: response, mac};
    } catch (e) {
        getNextLine(cue);
            if (response === 'nope'  && !done) {
                console.log(e)
                if (Array.isArray(e)) {
                    throw {err: e[0], info: e.slice(1), mac};
                } else {
                    throw {err: e, mac} ;
                }
            }
    }
}

function getNextLine(cue) {
    try {
        if (!cue.length)
            return [];

        //removeObsolete();

        if (cue.length === 1) {
            resolveLine(cue[0], cue);
            return;
        }

        const cmds = [];

        for (let i = cue.length - 1; i >= 0; i--) {
            const cmd = cue[i].command.cmd;
            if (!cmds.includes(cmd)) {
                cmds.push(cmd);
            } else {
                cue[i].prom.resolve(OBSOLETE);
                cue[i] = OBSOLETE;
            }
        }


        removeObsolete(cue);

        if (cue.length) {
            resolveLine(cue[0], cue);
        }
    } catch (e) {
        throw (e)
    }
}

const removeObsolete = cue => {
    let idx = cue.indexOf(OBSOLETE);
    while (idx != -1) {
        cue.splice(idx, 1);
        idx = cue.indexOf(OBSOLETE);
    }
};

const resolveLine = ({ip, key, keyType, command, prom}, cue) => {
    const done = {isDone: false};
    prom.promise.then(result => {
        if (result === OBSOLETE) {
            done.isDone = true;
        }
    });
    tcpsend(ip, buildCmd(command), key, keyType, done, command.settings)
        .then(response => {
            cue.shift();
            prom.resolve(response);
        })
        .catch(e => {
            cue.shift();
            prom.reject(e);
        })
};


const buildCmd = (cmdIn: Object): Object => {
    const cmd = cmdIn.cmd;
    const params = cmdIn.params;
    const obj = {};
    obj[cmd] = params;
    return obj;
};

const getCue = (cue) => {
    if (!cues[cue])
        cues[cue] = [];
    return cues[cue];
};

const dummy = () => {
}

/*

 */