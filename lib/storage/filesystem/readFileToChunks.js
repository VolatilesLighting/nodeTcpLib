import RNFetchBlob from 'react-native-fetch-blob';






export default async(filePath, CHUNK_SIZE = 4096) => {
    //await checkFirmware()
    try {
        console.log(filePath,CHUNK_SIZE)
        const {size, filename} = await RNFetchBlob.fs.stat(filePath)
        const stream = await  RNFetchBlob.fs.readStream(filePath, 'base64', CHUNK_SIZE)
        return chunkIt(stream, size, filename)

    } catch (e) {
        console.log(e)
    }
}


function chunkIt(stream, size, name) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.open()
        stream.onData((chunk) => {
            const chuchu =Buffer(chunk,'base64')
            //const chuchu = buf2hex(Buffer(RNFetchBlob.base64.decode(chunk)))
            //const chuchu = chunk
            //.map(x =>  x.toString(16)) (RNFetchBlob.base64.decode(
            chunks.push(chuchu)
        });

        stream.onEnd(() => {


            //const file = Buffer.concat(chunks,size)
            const file = Buffer.concat(chunks,size)
            resolve({chunks, size, file,name})
        });
        stream.onError((error) => {
            reject(error);
        });
    })
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(buffer, x => ( x.toString(16)));
}