import checkFirmware from '../../actions/checkFirmware';
import getScenes from '../../actions/getScenes';
import getPlaylists from '../../actions/getPlaylists';
import {checkHelp} from '../../actions/help';
//import checkCurrent from '../../actions/checkCurrent';



export default function () {
    //checkCurrent(true)
    checkFirmware()
    getScenes()
    getPlaylists()
    checkHelp()
}