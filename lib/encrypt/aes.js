/**
 * Created by flomair on 03.03.17.
 */
import ReactAES from 'react-native-aes-encryption';






export default {
    /***
     * @function encrypt
     * encrypts string with “AES/CFB” with no padding
     * @param text :string, key string
     * @param key string
     * @returns buffer
     */
    encrypt: function (text : string, key :string) :Promise{
        return new Promise((resolve, reject) => {
            //console.log(parseInt(hexString, 16);)
            ReactAES.encrypt(text, key).then((encrypted) => {
                resolve(base64ToBytes(encrypted))
            })
                .catch(
                    error => {
                        reject([CONSTS.messages.AES,error])
                    }
                );
        })
    },

    /***
     * @function decrypt
     * decrypts string with “AES/CFB” with no padding
     * @param text :buffer
     * @param key: string
     * @param iv : buffer
     * @returns string
     */
    decrypt: function (text : number[], key : string, iv: number[]):Promise {
        return new Promise((resolve, reject) => {
            return ReactAES.decrypt(text.toString('base64'), key, iv.toString('base64')).then((decrypted) => {
                resolve(decrypted);
            })
                .catch(
                    error => {
                        reject([CONSTS.messages.AES,error])
                    }
                );
        })
    }

}

function base64ToBytes(base) {
    return new Buffer(base, "base64")
}