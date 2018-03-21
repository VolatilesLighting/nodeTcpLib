/**
 * Created by flomair on 03.03.17.
 */
//import ReactAES from 'react-native-aes-encryption';

import crypto from 'crypto';




export default {
    encrypt: (message, keyIn) => {
        return new Promise((resolve, reject) => {
            try {
                const iv = crypto.randomBytes(16),
                    key = new Buffer(keyIn, 'hex'),
                    cipher = crypto.createCipheriv('aes-128-cfb', key, iv);
                let enc = cipher.update(message, 'utf8', 'hex');
                enc += cipher.final('hex');
                enc = iv.toString('hex') + enc;
                resolve(new Buffer(enc, 'hex'))
            }

            catch (e) {
                reject(e)
            }
        })
    },
    decrypt: function (enc, keyIn, iv) {
        return new Promise((resolve, reject) => {
            try {
                const key = new Buffer(keyIn, 'hex'),
                    decipher = crypto.createDecipheriv('aes-128-cfb', key, iv);
                //cipher.setAutoPadding(false);
                let recv = decipher.update(enc);
                recv += decipher.final('utf8');
                resolve(recv)
            } catch (e) {
                reject(e)
            }
        })
    },
    encryptServer: (message, keyIn,iv) => {
        return new Promise((resolve, reject) => {
            try {
                const key = new Buffer(keyIn, 'hex'),
                    cipher = crypto.createCipheriv('aes-128-cfb', key, iv);
                cipher.setAutoPadding(false);
                let enc = cipher.update(message, 'utf8', 'hex');

                resolve(new Buffer(enc, 'hex'))
            }

            catch (e) {
                reject(e)
            }
        })
    },
    decryptServer:(enc, keyIn, iv) => {
        return new Promise((resolve, reject) => {
            try {
                const key = new Buffer(keyIn, 'hex'),
                    decipher = crypto.createDecipheriv('aes-128-cfb', key, iv);
                let recv = decipher.update(enc);
                decipher.setAutoPadding(false);
                recv += decipher.final('utf8');
                //console.log('dfds',recv)
                resolve(recv.slice(recv.indexOf('{"')))
            } catch (e) {
                reject(e)
            }
        })
    }

}

function base64ToBytes(base) {
    return new Buffer(base, "base64")
}