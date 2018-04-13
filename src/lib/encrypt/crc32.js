import {crc32} from 'js-crc';


type as = array | string;
export default {


    /***
     * @function make
     * ads crcc32 checksum to json obj
     * {hello:'jo'} => {"op":  {"hello":"jo"}, "crc32": "0880abc5"} }
     * @param req :string or array
     * @returns string
     */

    make: function (req :as ) :string{
        let fullreq;
        if (Array.isArray(req)) {
            let reqs = req.map(function (line) {
                let crcstr = crc32(JSON.stringify(line));
                return {"op": line, "crc32": crcstr};
            });
            fullreq = JSON.stringify({"batch": reqs});
        } else {
            let mystr = JSON.stringify(req);
            let crcstr = crc32(mystr);
            fullreq = JSON.stringify({"op": req, "crc32": crcstr})
        }
        return fullreq;
    },


    /***
     * @function validate
     * checks if crc32 checksum is valid, an returns  obj valid or err
     * {hello:'jo'} => {"op":  {"hello":"jo"}, "crc32": "0880abc5"} }
     * @param resp :string
     * @returns string
     */
    validate: function (resp :string ) :Object{
        try {
            let response = JSON.parse(resp);
            console.log(Buffer(resp).toString('hex'))
            //  response.response.surface_runtime = 123;

            console.log(response.crc32,crc32(JSON.stringify(response.response)))
            let isClean = parseInt(response.crc32, 16) === parseInt(crc32(JSON.stringify(response.response)), 16);
            if (!isClean) {
                throw new Error(CONSTS.messages.CRC32)
            } else {
                return response.response
            }
        }catch (e){
            console.log(e,resp)
        }
    }
}
