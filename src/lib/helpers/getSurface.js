import discoverSurfaces from "../com/surfaceCom/discoverSurfaces";

export function getSurface(mac) {
    return new Promise(resolve => {
        const cb = ({id,ip_address}) =>
        {
            if(id === mac)
                resolve(ip_address)
        };
        discoverSurfaces({cb})
    })
}