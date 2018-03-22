
export const adler32Hex = (data)=>{
    "use strict";
    return sum(data,1).toString(16)
}


export const adler32Int = (data)=>{
    "use strict";
    return sum(data,1)
}


function sum (buf, sum)
{
    var NMAX = 5552;
    var BASE = 65521;
    if (sum == null)
        sum = 1;

    var a = sum & 0xFFFF,
        b = (sum >>> 16) & 0xFFFF,
        i = 0,
        max = buf.length,
        n, value;

    while (i < max)
    {
        n = Math.min(NMAX, max - i);

        do
        {
            a += buf[i++]<<0;
            b += a;
        }
        while (--n);

        a %= BASE;
        b %= BASE;
    }

    return ((b << 16) | a) >>> 0;
}