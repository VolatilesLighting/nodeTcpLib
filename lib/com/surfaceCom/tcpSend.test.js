/**
 * Created by flomair on 22.03.17.
 */

import tcpsend from './tcpSend';
import {tcpconfig as config} from '../config'
let mockCallbacks = {on: {}};
const mockSuccess = 'success';

import net from 'react-native-tcp';
import aes from '../../encrypt/aes';
import crc32 from '../../encrypt/crc32';
import wait from '../../helpers/wait';


jest.mock('../../helpers/wait', () =>
     jest.fn((data) => {
        return true;
}));

jest.mock('../../encrypt/aes', () => ({
    encrypt: jest.fn((data) => {
        return new Promise((resolve, reject) => {
            if (data === 'encryptfail') {
                reject('aes failed')
            } else {
                resolve(data)
            }
        })
    }),
    decrypt: jest.fn((data) => {
        return new Promise((resolve, reject) => {
            if (data === JSON.stringify({err: 'decryptfail'})) {
                reject('aes failed')
            } else {
                resolve(data);
            }
        })
    }),
}));


jest.mock('../../encrypt/crc32', () => ({
    validate: jest.fn(data => {
        if (data === 'validatefail') {
            throw 'not clean'
        }
        return JSON.parse(data);
    }),
    make: jest.fn(data => {
        return data;
    })
}));

const mocknetConnect = jest.fn((port, ip, cb) => {
    cb(mockCallbacks.connect);
});
const mocknetWrite = jest.fn(text => {
});
const mocknetDestroy = jest.fn(text => {
});
const mocknetOn = jest.fn((event, cb) => {
    if (mockCallbacks.on[event])
        cb(mockCallbacks.on[event]);
});


jest.mock('react-native-tcp', () => ({
    Socket: jest.fn(() => {
        return {
            connect: mocknetConnect,
            destroy: mocknetDestroy,
            write: mocknetWrite,
            on: mocknetOn
        }

    })
}));

describe('tcpsend', function () {
    describe('test succesfull handling', function () {
        it('shoul call the function tree and return decrypted validated data', async() => {
            const
                req = {hey: 'ho', ha: 'ho', hui: 'ho'},
                ip = 1,
                key = 2,
                keyType = 'master',
                reqstring = JSON.stringify(req);
            mockCallbacks.connect = true;
            mockCallbacks.on.connect = true;
            mockCallbacks.on.data = new Buffer(reqstring);

            const respre = tcpsend(ip, req, key, keyType);
            const res = await respre;
            expect(res).toEqual(req);

            expect(aes.encrypt.mock.calls.length).toBe(1);
            expect(aes.encrypt.mock.calls[0].length).toBe(2);
            expect(aes.encrypt.mock.calls[0][0]).toBe(req);
            expect(aes.encrypt.mock.calls[0][1]).toBe(key);

            expect(aes.decrypt.mock.calls.length).toBe(1);
            expect(aes.decrypt.mock.calls[0].length).toBe(3);
            expect(aes.decrypt.mock.calls[0][0]).toBe(mockCallbacks.on.data);
            expect(aes.decrypt.mock.calls[0][1]).toBe(key);
            expect(aes.decrypt.mock.calls[0][2]).toEqual(mockCallbacks.on.data.slice(0, 16));

            expect(crc32.make.mock.calls.length).toBe(1);
            expect(crc32.make.mock.calls[0].length).toBe(1);
            expect(crc32.make.mock.calls[0][0]).toBe(req);

            expect(crc32.validate.mock.calls.length).toBe(1);
            expect(crc32.validate.mock.calls[0].length).toBe(1);
            expect(crc32.validate.mock.calls[0][0]).toBe(reqstring);

            expect(net.Socket.mock.calls.length).toBe(1);
            expect(net.Socket.mock.calls[0][0]).toEqual({ setTimeout: config.timeout });

            expect(mocknetConnect.mock.calls.length).toBe(1);
            expect(mocknetConnect.mock.calls[0].length).toBe(3);
            expect(mocknetConnect.mock.calls[0][0]).toBe(config.ports['master']);
            expect(mocknetConnect.mock.calls[0][1]).toBe(ip);
            expect(typeof mocknetConnect.mock.calls[0][2]).toBe('function');

            expect(mocknetWrite.mock.calls.length).toBe(1);
            expect(mocknetWrite.mock.calls[0].length).toBe(1);
            expect(mocknetWrite.mock.calls[0][0]).toBe(req);

            expect(mocknetOn.mock.calls.length).toBe(3);
            expect(mocknetOn.mock.calls[0].length).toBe(2);
            expect(mocknetOn.mock.calls[0][0]).toBe('connect');
            expect(typeof mocknetOn.mock.calls[0][1]).toBe('function');
            expect(mocknetOn.mock.calls[1].length).toBe(2);
            expect(mocknetOn.mock.calls[1][0]).toBe('data');
            expect(typeof mocknetOn.mock.calls[1][1]).toBe('function');
            expect(mocknetOn.mock.calls[2].length).toBe(2);
            expect(mocknetOn.mock.calls[2][0]).toBe('error');
            expect(typeof mocknetOn.mock.calls[2][1]).toBe('function');
        });


        it('should select right ports', async() => {
            mocknetConnect.mockClear();
            const
                req = {hey: 'ho', ha: 'ho', hui: 'ho'},
                ip = 1,
                key = 2,
                keyType = 'visitor',
                reqstring = JSON.stringify(req);
            mockCallbacks.connect = true;
            mockCallbacks.on.connect = true;
            mockCallbacks.on.data = new Buffer(reqstring);

            await tcpsend(ip, req, key, 'visitor');
            expect(mocknetConnect.mock.calls[0][0]).toBe(config.ports['visitor']);
            await tcpsend(ip, req, key, 'master');
            expect(mocknetConnect.mock.calls[1][0]).toBe(config.ports['master']);
            await tcpsend(ip, req, "", "master");
            expect(mocknetConnect.mock.calls[2][0]).toBe(config.ports['public']);
            await tcpsend(ip, req, key);
            expect(mocknetConnect.mock.calls[3][0]).toBe(config.ports['public']);
            await tcpsend(ip, req);
            expect(mocknetConnect.mock.calls[4][0]).toBe(config.ports['public']);

        });
    });

    describe('test error handling', function () {
        const
            req = {hey: 'ho', ha: 'ho', hui: 'ho'},
            ip = 1,
            key = 2,
            keyType = 'visitor',
            reqstring = JSON.stringify(req);
        mockCallbacks.connect = true;
        mockCallbacks.on.connect = true;





        it('should retry as defined by config.decryptionRetrys and reject by crc32 messages', async() => {
            crc32.validate.mockClear();
            mocknetConnect.mockClear();
            mockCallbacks.on.data = new Buffer('validatefail');
            try {
                await tcpsend(ip, req, key, keyType);
            } catch (e) {
                expect(e).toEqual('not clean');
            }

            expect(crc32.validate.mock.calls.length).toBe(config.decryptionRetrys);
            expect(mocknetConnect.mock.calls.length).toBe(config.decryptionRetrys);
        });

        it('should retry as defined by config.decryptionRetrys and reject by decryption messages', async() => {
            aes.decrypt.mockClear();
           //crc32.validate.mockClear();
            mocknetConnect.mockClear();
            mockCallbacks.on.data = JSON.stringify({err: 'decryptfail'});
            try {
                await tcpsend(ip, req, key, keyType);
            } catch (err) {
                expect(err).toEqual('aes failed');
            }

            expect(aes.decrypt.mock.calls.length).toBe(config.decryptionRetrys);
            expect(mocknetConnect.mock.calls.length).toBe(config.decryptionRetrys);

        });
        it('should retry as defined by config.retrys and reject with tcp messages', async() => {
            net.Socket.mockClear();
            mocknetConnect.mockClear();
            jest.useFakeTimers();
            jest.runAllTimers();

            mockCallbacks.on.data = false;
            mockCallbacks.on.error = 'timeout';

            try {
                await tcpsend(ip, req, key, keyType);
                jest.runAllTimers();

            } catch (err) {
                expect(err).toEqual('tcperror');

            }
            expect(net.Socket.mock.calls.length).toBe(config.retrys);
            expect(net.Socket.mock.calls[0][0]).toEqual({"setTimeout": config.timeout});
            expect(wait.mock.calls.length).toBe(config.retrys);
            expect(wait.mock.calls[0][0]).toBe(config.delay);

        });
    });
});

