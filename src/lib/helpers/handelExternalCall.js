import {NavigationActions} from 'react-navigation'
import {getStore} from '../../store';
import * as types from '../../actions/actions';
import qrParser from './qrParser';


const MASTER = 'master',
    VISITOR = 'VISITOR';



export default handleExternalCall = (url) => {

    const store = getStore(),
        state = store.getState();
    console.log('handleExternalCall',state)
    const   surfaces = state.surfaces,
        sec = qrParser(url);
    const {type, id,} = getIdAndType(sec);


    if (type === VISITOR) {
        const surfacesFound = surfaces.filter((surf) => {
            return surf.id === id;
        });

        if (surfacesFound[0]) {
            setSurface(store,  sec,id)
        } else {
            addSurface(store, sec)
        }

        //openScreen(store)
    } else if (type === MASTER) {
        openScreen(store, 'surfaceAdd', sec)
    }
}


function setSurface(store, sec, id) {
    const state = store.getState();
    const surfaceID = state.surfaces.findIndex(surface => surface.id === id);
    const data = Object.assign({}, state.surfaces[surfaceID]);
    const editor = {
        data
    };
    setClaim(store,editor,sec)
}

function addSurface(store, sec){

    const data ={
        id: sec.visitor.id,
        key: sec.visitor.key,
        keyType: VISITOR
    };
    const editor = {
        data
    };
    setClaim(store,editor,sec)

}
function setClaim(store,editor,sec){
    store.dispatch({
        type: types.EDITOR_SET_DATA,
        payload: {
            ...editor,
            action: types.UPDATE_SURFACE
        }
    });
    openScreen(store, 'surfaceClaim', sec)
}

function getIdAndType(sec) {
    if (sec.master.id && sec.master.key) {
        return {type: MASTER, id: sec.master.id}
    }
    else if (sec.visitor.id && sec.visitor.key) {
        return {type: VISITOR, id: sec.visitor.id}
    }
}




function openScreen(store, screen, data) {
    const navigateAction = NavigationActions.navigate({
        routeName: screen,
        params: data,
    });
    store.dispatch(navigateAction)
}


