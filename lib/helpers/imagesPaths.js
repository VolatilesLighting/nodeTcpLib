import {Platform, PixelRatio} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import {picture} from '../com/remoteCom/downloadPaths.json';
import imageSizes from '../../consts/imageSizes';
import defaultImages from '../../assets/preload/images'
const imagesPath = Platform.OS === 'android' ? `file://${RNFetchBlob.fs.dirs.DocumentDir}${picture.local}` : `${RNFetchBlob.fs.dirs.DocumentDir}/${picture.local}`;



export default (path,type) =>{
    //console.log(path)


    if(path.includes('/default/')){
        const newPath = path.replace('/default/','i_').replace('.png','')
        console.log()
        return {imgUri : defaultImages[newPath]}
    }





    const imageType = imageSizes[type],
    width = PixelRatio.getPixelSizeForLayoutSize(imageType.width),
    height = PixelRatio.getPixelSizeForLayoutSize(imageType.height);
    let downloadPath ='',savePath,imgUri;
    switch (imageType.type){
        case 'qr':
            downloadPath = path.replace('/picture/',`/picture/qr/p/${width}/`);
            savePath = path.replace('.png',`-${width}.png`);
            imgUri = {uri:imagesPath + path.replace('.png',`-${width}.png`)};
            break;
        case 'wh':
            downloadPath = path.replace('/picture/',`/picture/wh/p/${width}_${height}/`);
            savePath = path.replace('.png',`-${width}_${height}.png`);
            imgUri = {uri:imagesPath + path.replace('.png',`-${width}_${height}.png`)};
            break;
        default:
            downloadPath = path;
            savePath = path;
            imgUri = {uri: imagesPath + path};
    }

    return {downloadPath,savePath,imgUri}
}


async function copyFiles(path) {

    const src = path.replace('/default/','../../assets/imgs/'),
        dest = path.replace('/default/',imagesPath+'/picture/');
   // console.log(src,dest)
    const exists = await RNFetchBlob.fs.exists(dest);
    const exists2 = await RNFetchBlob.fs.exists(src);
    console.log(src,exists2)
    console.log(dest,exists)
    //if(!exists)
     //   return await RNFetchBlob.fs.cp(src, dest);
}

/*
export default (path,type,width,height) =>{




    let downloadPath ='',savePath,imgUri;
    switch (type){
        case 'qr':
            downloadPath = path.replace('/picture/',`/picture/qr/p/${width}/`);
            savePath = path.replace('.png',`-${width}.png`);
            imgUri = imagesPath + path.replace('.png',`-${width}.png`);
            break;
        case 'wh':
            downloadPath = path.replace('/picture/',`/picture/wh/p/${width}_${height}/`);
            savePath = path.replace('.png',`-${width}_${height}.png`);
            imgUri = imagesPath + path.replace('.png',`-${width}_${height}.png`);
            break;
        default:
            downloadPath = path;
            savePath = path;
            imgUri = imagesPath + path;
    }

    return {downloadPath,savePath,imgUri}
}
    */