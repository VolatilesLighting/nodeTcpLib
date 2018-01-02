/**
 * Created by flomair on 29.03.17.
 */
import RNFetchBlob from 'react-native-fetch-blob';
const dirs = RNFetchBlob.fs.dirs.DocumentDir;


export default async(file: string, encoding: ('base64'| 'ascii'| 'utf8')) => {
    return RNFetchBlob.fs.readFile(file, encoding);
};





