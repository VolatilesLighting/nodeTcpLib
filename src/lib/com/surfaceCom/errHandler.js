import warning from '../../../actions/warning';
import {getStore} from '../../../store';
import stringTemplater from '../../helpers/stringTemplater';
import texts from '../../../assets/texts';
const errList = [], errTimers = {};
import {tcpconfig as config} from '../config';





export default {


    addErr: (error, tcp) => {

        if (!error)
            return;
        const surface = getSurface(error)
        if (!errList.includes(error) && surface) {

            errList.push(error)
            errTimers.error = setTimeout(() => {
                const cmd = {
                    mac: surface.id,
                    ip: surface.ip_address,
                    key: surface.key,
                    keyType: surface.keyType,
                    command: {get_surface_name: null}
                };
                tcp(cmd)
                    .then(() => {
                        this.remmoveErr(id)
                    }).catch(e => {
                    updateWarning(true)
                })
            }, config.finalFailTimeout)

            updateWarning()
        }

    },

    remmoveErr: (id) => {
        if (errList.includes(id)) {
            removeFromList(id)
            clearTimeout(errTimers[id])
            const currWarning = getWarning()
            if (currWarning.haswarning) {
                updateWarning()
            }
        }
    }
}


function updateWarning(final = false) {

    if (!errList.length) {
        warning.hide()
        return
    }

    const surfacenames = errList.map(error => {
        const surface = getSurface(error)
        console.log(surface)
        if (surface.name != '') {
            return surface.name
        } else {
            return surface.id
        }
    }).join(', ')
    warning.show({text: getText(surfacenames, final), final})

}


function getText(surfacenames, final) {
    const surfaces = {surfaces: surfacenames},
        isSingle = errList.length === 1;

    if (final) {
        if (isSingle)
            return stringTemplater(texts.tcpWarning.final.single, surfaces);
        return stringTemplater(texts.tcpWarning.final.multi, surfaces);
    } else {
        if (isSingle)
            return stringTemplater(texts.tcpWarning.preFinal.single, surfaces);
        return stringTemplater(texts.tcpWarning.preFinal.multi, surfaces);
    }
}

function getSurface(id) {
    return Object.assign({},getSurfaces().find(surface => surface.id === id))
}


function getWarning() {
    return getState().warning
}

function getState() {
    return getStore().getState()
}

function removeFromList(id) {
    const index = errList.indexOf(id);
    errList.splice(index, 1);
}



function getSurfaces(){
    return getState().surfaces.map(s => s)
}