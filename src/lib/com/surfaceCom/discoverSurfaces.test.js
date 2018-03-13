import dgram from 'react-native-udp';
import networkInfo from 'react-native-network-info';
import wait from  '../../helpers/wait';
import {udp as config} from '../config';
import discoverSurfaces from './discoverSurfaces';


const macaddress0 = '7375726630';
const macaddress1 = '7375726631';
const macaddress2 = '7375726632';

const mocknetInfo = [
    "volasystems",
    "0.0.0.0",
    "192.168.1.255"
];

const mockSurfaces = [];

jest.mock('../../helpers/wait', () =>
    jest.fn((data) => {
        return true;
    }));

jest.mock('react-native-network-info', () => ({
    all: jest.fn(() => {
        return Promise.resolve(mocknetInfo);
    })
}));

const mockTcpClose = jest.fn(text => {
});
const mockTcpBind = jest.fn((...args) => {

    args[2]();
});
const mockTcpsetBroadcast = jest.fn(text => {
});
const mockTcpSend = jest.fn(text => {
});
const mockTcpOn = jest.fn((text, cb) => {
    mockSurfaces.forEach((surface) => {
        const buffmessage = new Buffer(surface[0], "hex");
        cb(buffmessage, surface[1]);
    })
});


jest.mock('react-native-udp', () => ({
    createSocket: jest.fn(() => {
        return {
            close: mockTcpClose,
            bind: mockTcpBind,
            setBroadcast: mockTcpsetBroadcast,
            send: mockTcpSend,
            on: mockTcpOn
        }
    })
}));




describe('discoverSurfaces', function () {
    it('should return list of discovered surfaces', async() => {

        jest.useFakeTimers();
        mockSurfaces.push([config.packetPing + '3030303030303030303030303030303030303030' + macaddress0, {address: 111}]);
        mockSurfaces.push([config.packetAnswer + '3030303030303030303030303030303030303030' + macaddress1, {address: 123}]);
        mockSurfaces.push([config.packetAnswer + '3030303030303030303030303030303030303030' + macaddress1, {address: 123}]);
        mockSurfaces.push([config.packetAnswer + '3030303030303030303030303030303030303030' + macaddress2, {address: 124}]);
        const respre = discoverSurfaces();
        jest.runAllTimers();
        const res = await respre;

        expect(networkInfo.all.mock.calls.length).toBe(1);

        expect(dgram.createSocket.mock.calls.length).toBe(1);
        expect(dgram.createSocket.mock.calls[0].length).toBe(1);
        expect(dgram.createSocket.mock.calls[0][0]).toBe('udp4');


        expect(mockTcpsetBroadcast.mock.calls.length).toBe(1);
        expect(mockTcpsetBroadcast.mock.calls[0].length).toBe(1);
        expect(mockTcpsetBroadcast.mock.calls[0][0]).toBe(true);

        expect(mockTcpBind.mock.calls.length).toBe(1);
        expect(mockTcpBind.mock.calls[0].length).toBe(3);
        expect(mockTcpBind.mock.calls[0][0]).toBe(config.port);
        expect(mockTcpBind.mock.calls[0][1]).toBe("0.0.0.0");
        expect(typeof mockTcpBind.mock.calls[0][2]).toBe('function');


        expect(mockTcpsetBroadcast.mock.calls.length).toBe(1);
        expect(mockTcpsetBroadcast.mock.calls[0].length).toBe(1);
        expect(mockTcpsetBroadcast.mock.calls[0][0]).toBe(true);

        expect(mockTcpOn.mock.calls.length).toBe(1);
        expect(mockTcpOn.mock.calls[0].length).toBe(2);
        expect(mockTcpOn.mock.calls[0][0]).toBe('message');
        expect(typeof mockTcpOn.mock.calls[0][1]).toBe('function');

        expect(mockTcpClose.mock.calls.length).toBe(1);
        expect(mockTcpClose.mock.calls[0].length).toBe(0);

        expect(res).toEqual([
            {"ip_address": 123, "id": macaddress1,ssid : mocknetInfo[0] },
            {"ip_address": 124, "id": macaddress2,ssid : mocknetInfo[0] },
            mocknetInfo[0]
        ]);
    });

    it('should throw with hasudperror', async() => {

        jest.useFakeTimers();
        mockSurfaces.push([config.packetAnswer + '3030303030303030303030303030303030303030' + macaddress1, {adress: 123}]);
        mockSurfaces.push([config.packetAnswer + '3030303030303030303030303030303030303030' + macaddress1, {adress: 123}]);
        mockSurfaces.push([config.packetAnswer + '3030303030303030303030303030303030303030' + macaddress2, {adress: 124}]);

        try {
            const respre = discoverSurfaces();
            jest.runAllTimers();
        } catch (e) {


            expect(dgram.createSocket.mock.calls.length).toBe(1);
            expect(dgram.createSocket.mock.calls[0].length).toBe(1);
            expect(dgram.createSocket.mock.calls[0][0]).toBe('udp4');

            expect(mockTcpsetBroadcast.mock.calls.length).toBe(1);
            expect(mockTcpsetBroadcast.mock.calls[0].length).toBe(1);
            expect(mockTcpsetBroadcast.mock.calls[0][0]).toBe(true);

            expect(mockTcpBind.mock.calls.length).toBe(1);
            expect(mockTcpBind.mock.calls[0].length).toBe(3);
            expect(mockTcpBind.mock.calls[0][0]).toBe(config.port);
            expect(mockTcpBind.mock.calls[0][1]).toBe("0.0.0.0");
            expect(typeof mockTcpBind.mock.calls[0][2]).toBe('function');

            expect(mockTcpsetBroadcast.mock.calls.length).toBe(1);
            expect(mockTcpsetBroadcast.mock.calls[0].length).toBe(1);
            expect(mockTcpsetBroadcast.mock.calls[0][0]).toBe(true);

            expect(mockTcpOn.mock.calls.length).toBe(1);
            expect(mockTcpOn.mock.calls[0].length).toBe(2);
            expect(mockTcpOn.mock.calls[0][0]).toBe('message');
            expect(typeof mockTcpOn.mock.calls[0][1]).toBe('function');

            expect(mockTcpClose.mock.calls.length).toBe(1);
            expect(mockTcpClose.mock.calls[0].length).toBe(0);

            expect(e).toEqual('hasudperror');
        }
    });
});