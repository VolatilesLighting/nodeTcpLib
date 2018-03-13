/**
 * Created by flomair on 20.03.17.
 */


import ReactAES from 'react-native-aes-encryption';
import aes from './aes';

jest.mock('react-native-aes-encryption', () => ({
    encrypt: jest.fn((fail) => {
        return new Promise((resolve ,reject)=>{
            if(fail ===  'fail'){
                reject("failed")
            }else{
                resolve('c3VjYw==')
            }
        })
    }),
    decrypt: jest.fn((fail) => {
        return new Promise((resolve ,reject)=>{
            if(fail ===  'fail'){
                reject("failed")
            }else{
                let enct = 'decrypted' ;
                resolve(enct);
            }
        })
    }),
}));

describe('test AES', function() {


    describe('should call ReactAES.encypt with text and key', function() {
        it('shold resolve', async () => {
            const enct = new Buffer("succ") ;
            const res = await aes.encrypt('text','key');
            expect(res).toEqual(enct);
            expect(ReactAES.encrypt.mock.calls.length).toBe(1);
            expect(ReactAES.encrypt.mock.calls[0].length).toBe(2);
            expect(ReactAES.encrypt.mock.calls[0][0]).toBe("text");
            expect(ReactAES.encrypt.mock.calls[0][1]).toBe("key");
        });

        it('should reject', async () => {
            expect.assertions(1);
            try {
                await  await aes.encrypt('fail');
            } catch (res) {
                expect(res).toEqual('failed');
            }
        });
    });


    describe('should call ReactAES.encypt with text and key', function() {
        it('works with async/await', async () => {
            const textBuff = new Buffer("Text") ;
            const IVBuff = new Buffer("IV") ;
            const textBase = textBuff.toString('base64')
            const IVBase = IVBuff.toString('base64')

            const res = await aes.decrypt(textBuff,'key',IVBuff);

            expect(ReactAES.decrypt.mock.calls.length).toBe(1);
            expect(ReactAES.decrypt.mock.calls[0].length).toBe(3);
            expect(ReactAES.decrypt.mock.calls[0][0]).toBe(textBase);
            expect(ReactAES.decrypt.mock.calls[0][1]).toBe("key");
            expect(ReactAES.decrypt.mock.calls[0][2]).toBe(IVBase);
            expect(res).toEqual('decrypted');

        });

        it('works with async/await', async () => {
            expect.assertions(1);
            try {
                await  await aes.decrypt('fail',"","");
            } catch (res) {
                expect(res).toEqual('failed');
            }
        });
    });

});
