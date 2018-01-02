/**
 * Created by flomair on 27.03.17.
 */
import {backend as config} from '../config';
import remoteCom from './index';
import base64 from 'base-64';
import paths from './remotePaths.json';

const mockRoute = {
    "path": "/hey/you",
    "method": "WTF"
};
const mockSuccess = {suc: "success"};
const mockParams = {hey: 'ho', foo: 'bar'};
const mockUser = {email: 'visitor@vls.com', password: 'testpw'};
let mockFailer = true;





describe('remotecom', function () {
    it('should call fetch with path, method, Authorization and params', async() => {

        fetch.mockClear();
        const route = "getallscenes";
        const params = "hello";
        fetch.mockResponse(JSON.stringify(mockSuccess));
        const exp = config.host + paths[route].path + params;
        const exp2 = {
            "headers": {
                "Authorization": "Basic " + base64.encode(`${mockUser.email}:${mockUser.password}`),
                "Content-Type": "application/x-www-form-urlencoded"
            }, "method": paths[route].method
        };
        const res = await remoteCom(route, params, mockUser);
        expect(res).toEqual(mockSuccess);
        expect(fetch.mock.calls.length).toBe(1);
        expect(fetch.mock.calls[0][0]).toBe(exp);
        expect(fetch.mock.calls[0][1]).toEqual(exp2);
    });
});