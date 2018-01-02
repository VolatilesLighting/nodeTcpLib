/**
 * Created by flomair on 29.03.17.
 */
import RNFetchBlob from 'react-native-fetch-blob';
import read from './read';


let mockSuccess = true;




jest.mock('react-native-fetch-blob', () => ({
        fs: {
            dirs: {DocumentDir: 'DocumentDir'},
            readFile : jest.fn(() => {
                return mockSuccess;
            })
        }
    })
);


describe('readfile', function () {
    it('should call fetblob with correct params', async() => {
        const res = await read('scene','utf-8');
        expect(res).toEqual(mockSuccess);
        expect(RNFetchBlob.fs.readFile.mock.calls.length).toBe(1);
        expect(RNFetchBlob.fs.readFile.mock.calls[0].length).toBe(2);
        expect(RNFetchBlob.fs.readFile.mock.calls[0][0]).toEqual('DocumentDirscene');
        expect(RNFetchBlob.fs.readFile.mock.calls[0][1]).toEqual('utf-8');
    })
})