/**
 * Created by flomair on 21.03.17.
 */

import Deferred from '../../helpers/deferred';
import tcpsend from './tcpSend';
import manageTCP from './manageTCP';
const mockSuccess = "success";

jest.mock('./tcpSend', () =>
    jest.fn((...args) => {
        return new Promise((resolve, reject) => {
            if (args[0] === 'fail') {
                reject("failed")
            } else if (args[0]['push']) {
                args[0]['push'].then(() => {
                   //  console.log("resolveTCPSEND2")
                    resolve(mockSuccess);
                });
            } else {
                resolve(mockSuccess);
            }
        });
    }),
);

const pusher = (i) => {
    const pushpre = new Deferred();
    const def = {};
    def[`push${i}`] = pushpre;
    def[`promise${i}`] = pushpre.promise;
    return def;
};

describe('manageTCP', function () {
    describe('test empty cue', function () {
        const ip = 1,
            key = 2,
            keyType = "master",
            mac = 4,
            cmd = 5,
            params = 6,
            cue = [],
            command = {cmd, params},
            req = {
                ip,
                key,
                keyType,
                mac,
                command
            },

            resToExp = {mac, response: mockSuccess};

        it('should return object', async() => {
            const res = await manageTCP(req);
            expect(res).toEqual(resToExp);
            expect(tcpsend.mock.calls.length).toBe(1);
            expect(tcpsend.mock.calls[0][0]).toBe(ip);
            expect(tcpsend.mock.calls[0][1]).toEqual({"5": 6});
            expect(tcpsend.mock.calls[0][2]).toBe(key);
            expect(tcpsend.mock.calls[0][3]).toBe(keyType);
        });
               

        it('should call tcpsend and reject', async() => {
            tcpsend.mockClear();
            try {
                const res = await manageTCP("fail");
            } catch (res) {
                expect(res).toEqual('failed');
            }
        });
    });

    describe('test filled cue', function () {
        
        const ip = 1,
            key = 2,
            keyType = "master",
            mac = 4,
            cmd = "hey",
            params = 6,
            command = {cmd, params},
            resToExp = {mac, response: mockSuccess},
            req = {
                ip,
                key,
                keyType,
                mac,
                command
            };


        it('should call get nextline after resolving tcpsend', async() => {
            tcpsend.mockClear();
            const pushpre = new Deferred(),
                push = pushpre.promise,
                cmd2 = "ha",
                params2 = "new",
                cue2 = [],

                command2 = {cmd: cmd2, params: params2},
                newreq = {
                    ...req,
                    ip: {push}
                }, newreq2 = {
                    ...req,
                    command: command2,
                };
            newreq.cue = cue2;
            newreq2.cue = cue2;


            const respre = manageTCP(newreq);
            const res2pre = manageTCP(newreq2);


            pushpre.resolve();

            const res = await respre;
            expect(res).toEqual(resToExp);
            expect(tcpsend.mock.calls.length).toBe(2);
            expect(tcpsend.mock.calls[0][0]).toBe(newreq.ip);
            expect(tcpsend.mock.calls[0][1]).toEqual({'hey': params});
            expect(tcpsend.mock.calls[0][2]).toBe(2);
            expect(tcpsend.mock.calls[0][3]).toBe(keyType);


            const res2 = await res2pre;
            expect(res2).toEqual(resToExp);
            expect(tcpsend.mock.calls.length).toBe(2);
            expect(tcpsend.mock.calls[1][0]).toBe(req.ip);
            expect(tcpsend.mock.calls[1][1]).toEqual({'ha': params2});
            expect(tcpsend.mock.calls[1][2]).toBe(2);
            expect(tcpsend.mock.calls[1][3]).toBe(keyType);

        });


        it('should remove obsolete cmd duplicates and resolve these with obsolete', async() => {
            tcpsend.mockClear();
            const
                {push1, promise1} = pusher(1),
                {push2, promise2} = pusher(2),
                {push3, promise3} = pusher(3),
                {push4, promise4} = pusher(4),
                {push5, promise5} = pusher(5),
                {push6, promise6} = pusher(6),
                cue2 = [],
                resToExpObs = {
                    ...resToExp,
                    response: "OBSOLETE"
                },
                newreq = {
                    ...req,
                    ip: {push : promise1},
                },
                newreq2 = {
                    ...req,
                    ip: {push : promise2},
                    command: {cmd: 'hey', params: "old"},
                },
                newreq3 = {
                    ...req,
                    ip: {push : promise3},
                    command: {cmd: 'heyno', params: "stay"},
                },
                newreq4 = {
                    ...req,
                    ip: {push : promise4},
                    command: {cmd: 'hey', params: "new"},
                },
                newreq5 = {
                    ...req,
                    ip: {push : promise5},
                    command: {cmd: 'hey', params: "newer"},
                },
                newreq6 = {
                    ...req,
                    ip: {push : promise6},
                    command: {cmd: 'haha', params: "hold"},
                };


            const respre = manageTCP(newreq);
            const res2pre = manageTCP(newreq2);
            const res3pre = manageTCP(newreq3);
            const res4pre = manageTCP(newreq4);
            const res5pre = manageTCP(newreq5);
            const res6pre = manageTCP(newreq6);

            push1.resolve();
            push2.resolve();
            push3.resolve();
            push4.resolve();
            push5.resolve();
            push6.resolve();


            const res = await respre;
            expect(res).toEqual(resToExp);

            expect(tcpsend.mock.calls[0][0]).toBe(newreq.ip);
            expect(tcpsend.mock.calls[0][1]).toEqual({'hey': params});
            expect(tcpsend.mock.calls[0][2]).toBe(2);
            expect(tcpsend.mock.calls[0][3]).toBe(keyType);


            const res2 = await res2pre;
            expect(res2).toEqual(resToExpObs);

            const res3 = await res3pre;
            expect(res3).toEqual(resToExp);
            expect(tcpsend.mock.calls[1][0]).toBe(newreq3.ip);
            expect(tcpsend.mock.calls[1][1]).toEqual({'heyno': "stay"});
            expect(tcpsend.mock.calls[1][2]).toBe(2);
            expect(tcpsend.mock.calls[1][3]).toBe(keyType);


            const res4 = await res4pre;
            expect(res4).toEqual(resToExpObs);

            const res5 = await res5pre;
            expect(res5).toEqual(resToExp);
            expect(tcpsend.mock.calls[2][0]).toBe(newreq5.ip);
            expect(tcpsend.mock.calls[2][1]).toEqual({'hey': "newer"});
            expect(tcpsend.mock.calls[2][2]).toBe(2);
            expect(tcpsend.mock.calls[2][3]).toBe(keyType);

            const res6 = await res6pre;
            expect(res6).toEqual(resToExp);
            expect(tcpsend.mock.calls[3][0]).toBe(newreq6.ip);
            expect(tcpsend.mock.calls[3][1]).toEqual({'haha': "hold"});
            expect(tcpsend.mock.calls[3][2]).toBe(2);
            expect(tcpsend.mock.calls[3][3]).toBe(keyType);

        });
    });
});