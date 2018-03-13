
import updateFirmware from './lib/com/surfaceCom/updateFirmware'

const firmware ='',
ip ='',
key = '';


updateFirmware(firmware, ip, key, logger, ()=>{}).then(logger).catch(logger)

function logger(r){
  console.log()
}
