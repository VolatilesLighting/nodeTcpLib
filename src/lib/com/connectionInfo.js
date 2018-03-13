import {NetInfo} from 'react-native';
import broadcast from './broadcast'

let getSurfacesCB,
    foundNewCallback;

export default function (go,getSurfacesCBin, foundNewCallbackin) {
    let reachde ="WIFI"
    getSurfacesCB = getSurfacesCBin;
    foundNewCallback = foundNewCallbackin;

    NetInfo.fetch().done((reach) => {
        reachde = reach;
    });

    if(go){
        handleConnectivityChange('WIFI')
    }

    NetInfo.addEventListener(
        'change',
        handleConnectivityChange
    );
};


    function handleConnectivityChange(reach) {
        if(reach === 'WIFI'){
            broadcast(getSurfacesCB,foundNewCallback)
        }
    }