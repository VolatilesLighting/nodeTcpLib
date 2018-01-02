import {adler32Int} from '../../encrypt/adler32Hex';
import RNFetchBlob from 'react-native-fetch-blob';
import downloadPaths from '../../com/remoteCom/downloadPaths.json'
import readFileToChunks from './readFileToChunks'
const pathPre = RNFetchBlob.fs.dirs.DocumentDir;


export  default async(filename,type) =>{
    const file1 =  `${pathPre}${downloadPaths[type].local}${filename}`;
    const {file} = await readFileToChunks(file1)
    return adler32Int(file)
}