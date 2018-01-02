import RNFetchBlob from 'react-native-fetch-blob';
import {auth} from './index';
import {backend as config} from '../config';
import paths from './downloadPaths.json';
import download from './filedownload';

const mockFetch = jest.fn(() => {
    return mockRes;
})
const mockDirs = {DownloadDir: 'DownloadDir'};
const mockSuccess = {suc: "success"};
const mockParams = {hey: 'ho', foo: 'bar'};
const mockUser = {email: 'visitor@vls.com', password: 'testpw'};
let mockFailer = true;


const mockRes = {
    path: jest.fn(() => {
        return mockSuccess;
    })
};

jest.mock('react-native-fetch-blob', () => ({
        config: jest.fn(() => {
            return {
                fetch: mockFetch,
            }
        }),
        fs:{
            dirs : {DocumentDir: 'DocumentDir'}
        }

    })
);


describe('filedownload', function () {
    it('should call fetblob with correct params', async() => {

        const scene =1;
        const exp1 = {"fileCache": true, "path": RNFetchBlob.fs.dirs.DocumentDir +paths['scene'].local + scene};
        const exp2 = config.host +paths['scene'].remote + scene;
        const exp3 = {Authorization: auth(mockUser)};

        const res = await download('scene',scene,mockUser);

        expect(res).toEqual(mockSuccess);

        expect(RNFetchBlob.config.mock.calls.length).toBe(1);
        expect(RNFetchBlob.config.mock.calls[0].length).toBe(1);
        expect(RNFetchBlob.config.mock.calls[0][0]).toEqual(exp1);

        expect(mockFetch.mock.calls.length).toBe(1);
        expect(mockFetch.mock.calls[0].length).toBe(3);
        expect(mockFetch.mock.calls[0][0]).toEqual('GET');
        expect(mockFetch.mock.calls[0][1]).toEqual(exp2);
        expect(mockFetch.mock.calls[0][2]).toEqual(exp3);

        expect(mockRes.path.mock.calls.length).toBe(1);
        expect(mockRes.path.mock.calls[0].length).toBe(0);
    });
});