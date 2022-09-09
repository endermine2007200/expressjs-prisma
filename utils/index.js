const anonfile = require('anonfile-lib');
const fs = require('fs')
function encode(salt,text){
    const textToChars = (text) => text.split('').map((c)=>c.charCodeAt(0))
    const byteHex = (n) => ("0"+Number(n).toString(16)).substr(-2)
    const applSaltToChar = (code) => textToChars(salt).reduce((a,b)=> a ^ b, code)

    return text
        .split("")
        .map(textToChars)
        .map(applSaltToChar)
        .map(byteHex)
        .join("")
}
function decode(salt,text){
    const textToChars = (text) => text.split('').map((c)=>c.charCodeAt(0))
    const applSaltToChar = (code) => textToChars(salt).reduce((a,b)=> a ^ b, code)
    return text
        .match(/.{1,2}/g)
        .map((hex)=>parseInt(hex,16))
        .map(applSaltToChar)
        .map((charCode)=> String.fromCharCode(charCode))
        .join("")
}
async function tokey(path) {
	let res = await anonfile.upload(path);
	if (!res.status) return res.error.message
    let key = res.data.file.metadata.id
	return  key
}
module.exports = {encode , decode ,tokey}
