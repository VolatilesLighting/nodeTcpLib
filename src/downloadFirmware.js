import download from './lib/com/download.js';



export default async ({id,path}) =>{
    try {
        const creds = {
            'user': 'florian.mair@volatiles.lighting',
            'pass': '12345'
        },
            filename = (path || '.')+'/'+ id;

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