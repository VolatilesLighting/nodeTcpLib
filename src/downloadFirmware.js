import download from './lib/com/download.js';



export default async ({id,path,user,password}) =>{
    try {
        let creds = {
            'user': 'firmware@volatiles.lighting',
            'pass': 'HOLLYMOLLY'
        },
            filename = (path || '.')+'/'+ id;


        if(user&& password)
            creds = {
                user,
                pass: password
            };

        const r = await download({
            uri: `https://staging-volasystems.de:8445/firmware/fetch/bin/${id}`,
            filename,
            creds
        });
        console.log(`downloaded firmware '${id}' to ${r}`)
        return r;
    }catch (e){
        console.log(e)
        throw e
    }
}