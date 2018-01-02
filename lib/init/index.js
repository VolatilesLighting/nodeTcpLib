/**
 * Created by flomair on 31.03.17.
 */

import * as Sinfo  from '../storage/sensitiveInfo';
import * as realm from '../storage/realm';
import texts from '../../assets/texts';
//import * as datainit from './dataInit';
import playlistInit  from '../../assets/preload/playlist.json';
import scenesInit  from '../../assets/preload/scenes.json';



import logout from '../../actions/logout'


export default async() => {


    return new Promise((resolve, reject) => {


        const sensitive = Sinfo.getAll();
        const realmd = realm.dbreadAll();
        //const copied = copyImgs(RNFetchBlob);

        Promise.all([realmd, sensitive])
            .then(([db, secret]) => {

                console.log(db)
                console.log(secret)
                db.scenes = [];
                if (!db.scenes || !db.scenes.length) {
                    console.log('read')
                    db.playlists = playlistInit;
                    db.scenes = scenesInit;
                }

                if (!db.currentActive) {
                    db.currentActive = {surfaces: []}
                }

                if (db.surfaces && db.surfaces.length) {
                    db.surfaces.forEach((surface, i) => {
                        const sec = getkey(secret, surface.id);
                        db.surfaces[i] = {
                            ...surface,
                            connected: false,
                            ...sec,
                            currentActive: db.currentActive.surfaces.includes(surface.id)
                        };
                    });
                }


                //db.surfaces  = [];
                //db.currentActive = {surfaces:[]}

                const data = {
                    ...db,
                    ...secret,
                    texts
                };


                //data.user.password = '12345'

                // console.log(db)
                //  console.log(secret)
                resolve(data);
            }).catch(e => {
            if (e === 401) {
                logout()
            }
            console.log(e)
            reject(e);

            // throw (e)
        })
    })
}





const getkey = (secure, mac) => {

    try {
        const keys = secure.keys[secure.user.userID];

        let key = keys[mac]['master'];
        if (key)
            return {key, keyType: 'master'};
        key = keys[mac]['visitor'];
        if (key)
            return {key, keyType: 'visitor'};
        return {key: false, keyType: 'public'};
    } catch (e) {
        return {key: false, keyType: 'public'};
    }
};

