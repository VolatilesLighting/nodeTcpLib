/*

const str  ='My name is ${firstname} } ${lastname} ${firstname}',
    me = 'Susi',
    me2 = 'Sorglos';
console.log(formatter(str,{firstname :me , lastname:me2}))

=> My name is Susi } Sorglos Susi
 */


export default function formatter(string,variables){
    const preSplit = string.split('${');
    for(let i = 1; i < preSplit.length;i++){
        const  fullSplit =  preSplit[i].split('}'),
            id = fullSplit.splice(0,1);
        preSplit[i] = variables[id] + fullSplit.join('}')
    }
    return preSplit.join('')
}