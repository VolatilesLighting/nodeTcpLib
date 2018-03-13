/**
 * Created by flomair on 17.08.17.
 */
import randomBytes from 'randombytes'

export default   function getRandomKey(size,hex) {
    if(hex)
        size = size/2;
    return new Promise((resolve, reject) =>{
        randomBytes(size, function (err, resp) {
            if(err){
                reject(err)
            }else{
                console.log(resp,size)
                if(hex) {
                    resolve(resp.toString('hex'))
                }else{
                    resolve(resp)
                }
            }
        });
    })
}