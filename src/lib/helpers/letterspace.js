/**
 * Created by flomair on 16.06.17.
 */
export default function letterspace(text){
    function traverse (x,fn) {
        if (isArray(x)) {
            return  traverseArray(x,fn)
        } else if ((typeof x === 'object') && (x !== null)) {
            return traverseObject(x,fn)
        } else {
            return fn(x)
        }
    }

    function traverseArray (arr,fn) {
        return arr.map(x => {
            return traverse(x,fn)
        })
    }

    function traverseObject (obj,fn) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                obj[key] = traverse(obj[key],fn)
            }
        }
        return obj
    }

    function isArray (o) {
        return Object.prototype.toString.call(o) === '[object Array]'
    }

    return traverse(text,str =>{
        return str.split('').join('\u200A')
    })
}