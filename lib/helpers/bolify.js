/**
 * Created by flomair on 18.08.17.
 */
export default function bolify(ob){
    "use strict";
    return JSON.parse(JSON.stringify(ob).replace(/"true"/g,'true').replace(/"false"/g,'false'))
}