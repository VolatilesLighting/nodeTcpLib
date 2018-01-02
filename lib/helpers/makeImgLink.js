//import reactnativefs from 'react-native-fs';
import RNFetchBlob from 'react-native-fetch-blob';
import {picture} from '../com/remoteCom/downloadPaths.json'
import {
    Platform,
} from 'react-native';
const { fs, fetch, wrap } = RNFetchBlob











export default async (imgIN) => {
    const downloadPath = getImgPath() + imgIN;
    const assetPath = wrap(fs.asset('i_'+imgIN.replace(/^\D+|\D+$/g, "")+'.png'))

    console.log(downloadPath)
    RNFetchBlob.fs.lstat('../../data')
    // files will an array contains filenames
        .then((files) => {
            console.log(files)
        })

    const exists2 = await fs.exists(downloadPath)
        console.log(exists2)
    return assetPath
}





function assetPath (){
    return Platform.OS === 'android' ? `file://${fs.dirs.DocumentDir}${picture.local}` : `${fs.dirs.DocumentDir}${picture.local}`
}

function getImgPath (){
    return Platform.OS === 'android' ? `file://${fs.dirs.DocumentDir}${picture.local}` : `${fs.dirs.DocumentDir}${picture.local}`
}