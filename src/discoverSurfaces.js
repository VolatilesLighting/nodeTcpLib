import discoverSurfaces from './lib/com/surfaceCom/discoverSurfaces'
import tcpsend from './lib/com/surfaceCom/tcpsend'
require('console.table');


export const discover = async (full) => {
    const surfaces = await discoverSurfaces(cb => {
        }),
        dets = surfaces.map(async surface => {
            //console.log(surface)
            try {
                const resp = await  tcpsend(surface.ip_address, {get_pub_info: null}, false, 'public', {}, {timeout: 2000,log:false});
                //console.log(resp)
                if (!full)
                    return {name: resp.name, ...surface};
                return {name: resp.name, ...surface, data: JSON.stringify(resp)};
            }catch (e){
                return {name: e, ...surface};
            }
        });
    const dat = await Promise.all(dets)
    console.table(dat)
}

//disc().catch(e => console.log(e))
