
export default (success,err) =>{
    return new Promise((resolve,reject)=>{
        if(err)
            reject(err);
        resolve(success);
    })
}

