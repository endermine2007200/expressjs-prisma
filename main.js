const {default:makeWASocket,delay : delay, DisconnectReason, MessageRetryMap, useSingleFileAuthState, fetchLatestBaileysVersion, toBuffer } = require('@adiwajshing/baileys')
const fs = require('fs')
const pino = require("pino")
const utils = require('./utils')
global.conns = {}
function start(id){
    let auth = false
    if (id == false | null | undefined) auth = false
    let db = require('./db/db.json')
    if(db[id] == null | false ||  db[id] != true) auth = false
    else{
            auth = true
        }
    if (auth){
            let authFile = './src/'+id+'.json'
            let { state, saveState} = useSingleFileAuthState(authFile)
            
            conn = makeWASocket({
                printQRInTerminal: false,
                logger : pino({
                    level : 'silent'
                    }),
                browser : ['BAAA3', "MacOs", "3.0.0"],
                auth : state,
                version: [3, 3234, 9]
            });
            
            global.conns[id] = conn
            conn.ev.on("connection.update", async({qr}) => {
                global.conns[id].qr = qr
            })
            conn.ev.on("connection.update", async(state) => {
                const {
                    connection : phase,
                    lastDisconnect : needsCalculated
                } = state;
                if (phase == "open") {
                    db[id] = authFile
                    fs.writeFile('./db/db.json',JSON.stringify(db),(err)=>{})
                    await delay(500 * 10);
                    const doc = fs.readFileSync(`src/${id}.json`);
                    let code_key = utils.encode('Baaa3',await utils.tokey(__dirname+'/src/'+id+'.json'))
                    await fs.unlink(authFile,()=>{})
                    let templateButtons = [{ urlButton: { displayText: 'Copy💾', url: 'https://www.whatsapp.com/otp/copy/' + code_key }}]

                    await conn.sendMessage(conn.user.id, { text: 'Baaa3🐑', footer: 'COPY THIS CODE📄', templateButtons })
                    conn.ws.close()
                }if (phase === "close" && needsCalculated && needsCalculated.error){
                    start(id)
                }
            })
            conn.ev.on("creds.update", saveState)
            conn.ev.on("messages.upsert", async () => {
            });
                
        }
}

function create(){
    const randomID = length => require('crypto').randomBytes(Math.ceil(length * .5)).toString('hex').slice(0, length)
    let db = require('./db/db.json')
    id = randomID(10)
    db[id] = true
    fs.writeFileSync('./db/db.json',JSON.stringify(db),(err)=>{})
        start(id)
    return id
}

function get(id){
    try{
        if (!global.conns[id]) return `error` 
        return global.conns[id].qr
    }catch{
        return 'error'
    }
}

function stop(id){
    try{
        global.conns[id].ws.close()
        global.conns[id] = null
        let db = require('./db/db.json')
        db[id] = false
        fs.writeFileSync('./db/db.json',JSON.stringify(db),(err)=>{})
       return 'Done!'
    }catch{
        return 'e not found'
    }
} 




module.exports = {start,create,get,stop}
