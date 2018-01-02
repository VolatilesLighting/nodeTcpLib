export const stringtoHex = str =>{
    let hex = '';
    for(let i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
};

export const hex2string = hexx =>{
    const hex = hexx.toString();
    let  str = '';
    for (let i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
};
