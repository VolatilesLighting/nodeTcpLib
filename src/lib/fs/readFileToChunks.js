/**
 * Created by flomair on 27.07.17.
 */
import fs from 'fs';
import path from 'path';
export default (filePath, CHUNK_SIZE) =>{
    return new Promise((resolve, reject) => {
        try {
            const chunks = [],
                readStream = fs.createReadStream(filePath, {highWaterMark: CHUNK_SIZE});
            let size = 0;
            readStream.on('data', function (chunk) {
                chunks.push(chunk)
                size += chunk.length
            });
            readStream.on('close', function () {
                const file = Buffer.concat(chunks,size)
                resolve({chunks,size,file, name: path.basename(filePath)})
            });
            readStream.on('error', function (error) {
                reject(error)
            });
        } catch (e) {
            reject(e)
        }
    })
}