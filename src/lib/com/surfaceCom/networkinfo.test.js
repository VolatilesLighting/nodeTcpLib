/**
 * Created by flomair on 27.03.17.
 */

import {NativeModules} from 'react-native';
import networkInfo from './networkInfo';


const mockReturn = {
    SSID: "ssid",
    ip: "IP",
    broadcastIP: "broadcastIP",
};

jest.mock('react-native', () => ({
    NativeModules: {
        RNNetworkInfo: {
            getSSID: jest.fn((cb) => {
                cb(mockReturn.SSID);
            }),
            getIPAddress: jest.fn((cb) => {
                cb(mockReturn.ip);
            }),
            getBroadcastAddress: jest.fn((cb) => {
                cb(mockReturn.broadcastIP);
            }),
        }
    }
}));



describe('get networkinfo', function () {
    it('should return ssid,IPAddress and BroadcastAddress', async() => {
            const netInfo = await networkInfo.all();
            expect(netInfo).toEqual(mockReturn);
    });
});


