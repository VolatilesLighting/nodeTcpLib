import request from 'request';
import fs from 'fs-extra';
import path from 'path';

export default async function loadData({uri, filename, creds}) {
    await fs.ensureDir(path.dirname(path.join(process.cwd(), filename)));
    return new Promise((resolve, reject) => {
        "use strict";
        //console.log(uri)
        request({
            //json: true,
            uri,
            body: null,
            method: 'GET',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            'auth': {
                ...creds,
                'sendImmediately': true
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                resolve(path.join(process.cwd(), filename));
            }
            reject(error || body)

        })
            .pipe(fs.createWriteStream(path.join(process.cwd(), filename)))
            .on('error', (e) => {
                reject(e)
            })
    })
}



