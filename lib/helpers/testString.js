export default function testString(string,{regex ,min = 0,max = 999}) {

    const r= regex.test(string), mi = string.length >= min, ma =string.length <= max;
    console.log(r,mi,ma)
    return r && mi && ma
}