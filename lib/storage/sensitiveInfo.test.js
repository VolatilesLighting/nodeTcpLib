/**
 * Created by flomair on 28.03.17.
 */
import Sinfo from 'react-native-sensitive-info';
import config from './config.json';
import * as sensitiveInfo from './sensitiveInfo';

let mockReturn = "{\"sd\":\"dada\"}";
let mockError = false;



jest.mock('react-native-sensitive-info', () => ({
    getItem : jest.fn(() => {
        return new Promise((resolve, reject) => {
            if (mockError)
                reject(mockError);
            resolve(mockReturn)
        })}),
    deleteItem: jest.fn(() => {
        return new Promise((resolve, reject) => {
            if (mockError)
                reject(mockError);
            resolve(mockReturn)
        })}),
    getAllItems: jest.fn(() => {
        return new Promise((resolve, reject) => {
            if (mockError)
                reject(mockError);
            resolve(mockReturn)
        })}),
    setItem: jest.fn(() => {
        return new Promise((resolve, reject) => {
            if (mockError)
                reject(mockError);
            resolve(mockReturn)
        })}),
}));


describe('sensitiveInfo', function () {
    it('should call getItem and resolve with parsed object', async() => {
        Sinfo.getAllItems.mockClear();

        const exp = JSON.parse(mockReturn);
        const res = await sensitiveInfo.getItem('hey');
        expect(res).toEqual(exp);
        expect(Sinfo.getItem.mock.calls.length).toBe(1);
        expect(Sinfo.getItem.mock.calls[0].length).toBe(2);
        expect(Sinfo.getItem.mock.calls[0][0]).toBe('hey');
        expect(Sinfo.getItem.mock.calls[0][1]).toEqual(config);
    });
    it('should call getALL and resolve with parsed object', async() => {
        Sinfo.getAllItems.mockClear();
        mockReturn = {ds:JSON.stringify({sd:'dada'}),sd:JSON.stringify({ssdd:'dadas'})};

        const exp = {ds:{sd:'dada'},sd:{ssdd:'dadas'}};
        const res = await sensitiveInfo.getAll();
        expect(res).toEqual(exp);
        expect(Sinfo.getAllItems.mock.calls.length).toBe(1);
        expect(Sinfo.getAllItems.mock.calls[0].length).toBe(1);
        expect(Sinfo.getAllItems.mock.calls[0][0]).toEqual(config);
    });
    it('should call setItem and resolve', async() => {
        Sinfo.setItem.mockClear();
        mockReturn = true;
        const res = await sensitiveInfo.setItem('foo','bar');
        expect(res).toEqual(mockReturn);
        expect(Sinfo.setItem.mock.calls.length).toBe(1);
        expect(Sinfo.setItem.mock.calls[0].length).toBe(3);
        expect(Sinfo.setItem.mock.calls[0][0]).toEqual('foo');
        expect(Sinfo.setItem.mock.calls[0][1]).toEqual('bar');
        expect(Sinfo.setItem.mock.calls[0][2]).toEqual(config);
    });
    it('should call setItem and resolve', async() => {
        Sinfo.deleteItem.mockClear();
        mockReturn = true;
        const res = await sensitiveInfo.deleteItem('foo');
        expect(res).toEqual(mockReturn);
        expect(Sinfo.deleteItem.mock.calls.length).toBe(1);
        expect(Sinfo.deleteItem.mock.calls[0].length).toBe(2);
        expect(Sinfo.deleteItem.mock.calls[0][0]).toEqual('foo');
        expect(Sinfo.deleteItem.mock.calls[0][1]).toEqual(config);
    });

    it('should throw on Error', async() => {
        Sinfo.deleteItem.mockClear();
        mockReturn = true;
        mockError = true;
        try{
                sensitiveInfo.deleteItem('foo');
        }catch (e) {
            expect(e).toEqual(mockReturn);
            expect(Sinfo.deleteItem.mock.calls.length).toBe(1);
            expect(Sinfo.deleteItem.mock.calls[0].length).toBe(2);
            expect(Sinfo.deleteItem.mock.calls[0][0]).toEqual('foo');
            expect(Sinfo.deleteItem.mock.calls[0][1]).toEqual(config);
        }
    });
});