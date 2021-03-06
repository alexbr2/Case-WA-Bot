const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')

const fs = require("fs")
const axios = require('axios')
const request = require('request')
const ffmpeg = require('fluent-ffmpeg')
const moment = require('moment-timezone')

const { apikey, prefix } = JSON.parse(fs.readFileSync('./config.json'))

const { fetchJson, getBuffer } = require('./lib/fetcher')
const { color } = require('./lib/color')
const { getRandom } = require('./lib/function')
const { help, donate } = require('./help/help')

async function starts() {
    const lolhuman = new WAConnection()
    lolhuman.logger.level = 'warn'
    lolhuman.on('qr', () => {
        console.log(color('[', 'red'), color('!', 'yellow'), color(']', 'red'), color(' Scan the qr code above', 'green'))
    })

    fs.existsSync('./lolhuman.json') && lolhuman.loadAuthInfo('./lolhuman.json')
    lolhuman.on('connecting', () => {
        const time_connecting = moment.tz('Asia/Jakarta').format('HH:mm:ss')
        console.log(color(time_connecting, "white"), color("[  STATS  ]", "aqua"), "Connecting...")
    })
    lolhuman.on('open', () => {
        const time_connect = moment.tz('Asia/Jakarta').format('HH:mm:ss')
        console.log(color(time_connect, "white"), color("[  STATS  ]", "aqua"), "Connected")
    })
    await lolhuman.connect({ timeoutMs: 30 * 1000 })
    fs.writeFileSync('./lolhuman.json', JSON.stringify(lolhuman.base64EncodedAuthInfo(), null, '\t'))

    lolhuman.on('chat-update', async(lol) => {
        const time = moment.tz('Asia/Jakarta').format('HH:mm:ss')
        try {
            if (!lol.hasNewMessage) return
            lol = JSON.parse(JSON.stringify(lol)).messages[0]
            if (!lol.message) return
            if (lol.key && lol.key.remoteJid == 'status@broadcast') return
            if (lol.key.fromMe) return
            global.prefix
            const content = JSON.stringify(lol.message)
            const from = lol.key.remoteJid
            const type = Object.keys(lol.message)[0]
            const insom = from.endsWith('@g.us')
            const nameReq = insom ? lol.participant : lol.key.remoteJid
            pushname2 = lolhuman.contacts[nameReq] != undefined ? lolhuman.contacts[nameReq].vname || lolhuman.contacts[nameReq].notify : undefined

            const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType

            const pesan = type === 'conversation' ? lol.message.conversation : lol.message.extendedTextMessage.text
            body = (type === 'conversation' && pesan.startsWith(prefix)) ? pesan : (type == 'imageMessage') && lol.message.imageMessage.caption.startsWith(prefix) ? lol.message.imageMessage.caption : (type == 'videoMessage') && lol.message.videoMessage.caption.startsWith(prefix) ? lol.message.videoMessage.caption : (type == 'extendedTextMessage') && lol.message.extendedTextMessage.text.startsWith(prefix) ? lol.message.extendedTextMessage.text : ''
            budy = (type === 'conversation') ? pesan : (type === 'extendedTextMessage') ? lol.message.extendedTextMessage.text : ''
            var Link = (type === 'conversation' && pesan) ? pesan : (type == 'imageMessage') && lol.message.imageMessage.caption ? lol.message.imageMessage.caption : (type == 'videoMessage') && lol.message.videoMessage.caption ? lol.message.videoMessage.caption : (type == 'extendedTextMessage') && lol.message.extendedTextMessage.text ? lol.message.extendedTextMessage.text : ''
            const messagesLink = Link.slice(0).trim().split(/ +/).shift().toLowerCase()
            const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
            const args = body.trim().split(/ +/).slice(1)
            const argsjoin = args.join(' ')
            const isCmd = body.startsWith(prefix)
            lolhuman.chatRead(from)

            const botNumber = lolhuman.user.jid
            const isGroup = from.endsWith('@g.us')
            const sender = isGroup ? lol.participant : lol.key.remoteJid
            const groupMetadata = isGroup ? await lolhuman.groupMetadata(from) : ''
            const groupName = isGroup ? groupMetadata.subject : ''
            const totalchat = await lolhuman.chats.all()

            const isUrl = (ini_url) => {
                return ini_url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
            }
            const reply = (teks) => {
                lolhuman.sendMessage(from, teks, text, { quoted: lol })
            }
            const sendMess = (hehe, teks) => {
                lolhuman.sendMessage(hehe, teks, text)
            }
            const costum = (pesan, tipe, target, target2) => {
                lolhuman.sendMessage(from, pesan, tipe, { quoted: { key: { fromMe: false, participant: `${target}`, ...(from ? { remoteJid: from } : {}) }, message: { conversation: `${target2}` } } })
            }
            const mentions = (teks, memberr, id) => {
                (id == null || id == undefined || id == false) ? lolhuman.sendMessage(from, teks.trim(), extendedText, { contextInfo: { "mentionedJid": memberr } }): lolhuman.sendMessage(from, teks.trim(), extendedText, { quoted: lol, contextInfo: { "mentionedJid": memberr } })
            }

            colors = ['red', 'white', 'black', 'blue', 'yellow', 'green', 'aqua']
            const isMedia = (type === 'imageMessage' || type === 'videoMessage')
            const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
            const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
            const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')

            if (!isGroup && !isCmd) console.log(color(time, "white"), color("[ PRIVATE ]", "aqua"), color(pesan, "white"), "from", color(sender.split('@')[0], "yellow"))
            if (isGroup && !isCmd) console.log(color(time, "white"), color("[  GROUP  ]", "aqua"), color(pesan, "white"), "from", color(sender.split('@')[0], "yellow"), "in", color(groupName, "yellow"))
            if (!isGroup && isCmd) console.log(color(time, "white"), color("[ COMMAND ]", "aqua"), color(pesan, "white"), "from", color(sender.split('@')[0], "yellow"))
            if (isGroup && isCmd) console.log(color(time, "white"), color("[ COMMAND ]", "aqua"), color(pesan, "white"), "from", color(sender.split('@')[0], "yellow"), "in", color(groupName, "yellow"))

            switch (command) {
                case 'help':
                    reply(help(prefix))
                    break
                case 'donate':
                    reply(donate(pushname2))
                    break
                case 'alquran':
                    if (args.length < 1) return reply('_Example: !alquran 108_')
                    urls = `https://lolhuman.herokuapp.com/api/quran/${args[0]}?apikey=${apikey}`
                    quran = await fetchJson(urls)
                    result = quran.result
                    ayat = result.ayat
                    txt = `QS. ${result.surah} : 1-${ayat.length}\n\n`
                    for (var x in ayat) {
                        test = ayat[x]
                        arab = test.arab
                        nomor = test.ayat
                        latin = test.latin
                        indo = test.indonesia
                        txt += `${arab}\n${nomor}. ${latin}\n${indo}\n\n`
                    }
                    txt = txt.replace(/<u>/g, "").replace(/<\/u>/g, "")
                    txt = txt.replace(/<strong>/g, "").replace(/<\/strong>/g, "")
                    txt = txt.replace(/<u>/g, "").replace(/<\/u>/g, "")
                    reply(txt)
                    break
                case 'quotes':
                    quotes = await fetchJson(`https://lolhuman.herokuapp.com/api/random/quotes?apikey=${apikey}`)
                    quotes = quotes.result
                    author = quotes.by
                    quotes = quotes.quote
                    reply(`_${quotes}_\n\n*― ${author}*`)
                    break
                case 'quotesdilan':
                    quotedilan = await fetchJson(`https://lolhuman.herokuapp.com/api/quotes/dilan?apikey=${apikey}`)
                    reply(quotedilan.result)
                    break
                case 'jadwaltv':
                    channel = args[0]
                    tvnow = await fetchJson(`https://lolhuman.herokuapp.com/api/jadwaltv/${channel}?apikey=${apikey}`)
                    tvnow = tvnow.result
                    txt = `Jadwal TV ${channel.toUpperCase()}\n`
                    for (var x in tvnow) {
                        txt += `${x} - ${tvnow[x]}\n`
                    }
                    reply(txt)
                    break
                case 'nhentai':
                    henid = args[0]
                    get_result = await fetchJson(`https://lolhuman.herokuapp.com/api/nhentai/${henid}?apikey=${apikey}`)
                    get_result = get_result.result
                    txt = `Title Romaji : ${get_result.title_romaji}\n`
                    txt += `Title Native : ${get_result.title_native}\n`
                    txt += `Read Online : ${get_result.read}\n`
                    get_info = get_result.info
                    txt += `Parodies : ${get_info.parodies}\n`
                    txt += `Character : ${get_info.characters.join(", ")}\n`
                    txt += `Tags : ${get_info.tags.join(", ")}\n`
                    txt += `Artist : ${get_info.artists}\n`
                    txt += `Group : ${get_info.groups}\n`
                    txt += `Languager : ${get_info.languages.join(", ")}\n`
                    txt += `Categories : ${get_info.categories}\n`
                    txt += `Pages : ${get_info.pages}\n`
                    txt += `Uploaded : ${get_info.uploaded}\n`
                    reply(txt)
                    break
                case 'nhentaipdf':
                    henid = args[0]
                    get_result = await fetchJson(`https://lolhuman.herokuapp.com/api/nhentaipdf/${henid}?apikey=${apikey}`)
                    get_result = get_result.result
                    buffer = await getBuffer(get_result)
                    lolhuman.sendMessage(from, buffer, document, { quoted: lol, mimetype: Mimetype.pdf, filename: `${henid}.pdf` })
                    break
                case 'yaoi':
                    buffer = await getBuffer(`https://lolhuman.herokuapp.com/api/random/nsfw/yaoi?apikey=${apikey}`)
                    lolhuman.sendMessage(from, buffer, image, { quoted: lol })
                    break
                case 'yuri':
                    img = await fetchJson(`https://lolhuman.herokuapp.com/api/random2/yuri?apikey=${apikey}`)
                    img = img.result
                    buffer = await getBuffer(img)
                    lolhuman.sendMessage(from, buffer, image, { quoted: lol })
                    break
                case 'wancak':
                    buffer = await getBuffer(`https://lolhuman.herokuapp.com/api/onecak?apikey=${apikey}`)
                    lolhuman.sendMessage(from, buffer, image, { quoted: lol })
                    break
                case 'ephoto1':
                    txt = args.join(" ")
                    buffer = await getBuffer(`https://lolhuman.herokuapp.com/api/ephoto1/wetglass?apikey=${apikey}&text=${txt}`)
                    lolhuman.sendMessage(from, buffer, image, { quoted: lol })
                    break
                case 'ephoto2':
                    txt1 = args[0]
                    txt2 = args[1]
                    buffer = await getBuffer(`https://lolhuman.herokuapp.com/api/ephoto2/codwarzone?apikey=${apikey}&text1=${txt1}&text2=${txt2}`)
                    lolhuman.sendMessage(from, buffer, image, { quoted: lol })
                    break
                case 'photoeditor':
                    ini_url = args[0]
                    buffer = await getBuffer(`https://lolhuman.herokuapp.com/api/editor/fisheye?apikey=${apikey}&img=${ini_url}`)
                    lolhuman.sendMessage(from, buffer, image, { quoted: lol })
                    break
                case 'kusonime':
                    ini_url = args[0]
                    get_result = await fetchJson(`https://lolhuman.herokuapp.com/api/kusonime?apikey=${apikey}&url=${ini_url}`)
                    get_result = get_result.result
                    txt = `Title : ${get_result.title}\n`
                    txt += `Japanese : ${get_result.japanese}\n`
                    txt += `Genre : ${get_result.genre}\n`
                    txt += `Seasons : ${get_result.seasons}\n`
                    txt += `Producers : ${get_result.producers}\n`
                    txt += `Type : ${get_result.type}\n`
                    txt += `Status : ${get_result.status}\n`
                    txt += `Total Episode : ${get_result.total_episode}\n`
                    txt += `Score : ${get_result.score}\n`
                    txt += `Duration : ${get_result.duration}\n`
                    txt += `Released On : ${get_result.released_on}\n`
                    txt += `Desc : ${get_result.desc}\n`
                    link_dl = get_result.link_dl
                    for (var x in link_dl) {
                        txt += `\n${x}\n`
                        for (var y in link_dl[x]) {
                            txt += `${y} - ${link_dl[x][y]}\n`
                        }
                    }
                    buffer = await getBuffer(get_result.thumbnail)
                    lolhuman.sendMessage(from, buffer, image, { quoted: lol, caption: txt })
                    break
                case 'kusonimesearch':
                    query = args.join(" ")
                    get_result = await fetchJson(`https://lolhuman.herokuapp.com/api/kusonimesearch?apikey=${apikey}&query=${query}`)
                    get_result = get_result.result
                    txt = `Title : ${get_result.title}\n`
                    txt += `Japanese : ${get_result.japanese}\n`
                    txt += `Genre : ${get_result.genre}\n`
                    txt += `Seasons : ${get_result.seasons}\n`
                    txt += `Producers : ${get_result.producers}\n`
                    txt += `Type : ${get_result.type}\n`
                    txt += `Status : ${get_result.status}\n`
                    txt += `Total Episode : ${get_result.total_episode}\n`
                    txt += `Score : ${get_result.score}\n`
                    txt += `Duration : ${get_result.duration}\n`
                    txt += `Released On : ${get_result.released_on}\n`
                    txt += `Desc : ${get_result.desc}\n`
                    link_dl = get_result.link_dl
                    for (var x in link_dl) {
                        txt += `\n${x}\n`
                        for (var y in link_dl[x]) {
                            txt += `${y} - ${link_dl[x][y]}\n`
                        }
                    }
                    buffer = await getBuffer(get_result.thumbnail)
                    lolhuman.sendMessage(from, buffer, image, { quoted: lol, caption: txt })
                    break
                case 'otakudesu':
                    ini_url = args[0]
                    get_result = await fetchJson(`https://lolhuman.herokuapp.com/api/otakudesu?apikey=${apikey}&url=${ini_url}`)
                    get_result = get_result.result
                    txt = `Title : ${get_result.title}\n`
                    txt += `Japanese : ${get_result.japanese}\n`
                    txt += `Judul : ${get_result.judul}\n`
                    txt += `Type : ${get_result.type}\n`
                    txt += `Episode : ${get_result.episodes}\n`
                    txt += `Aired : ${get_result.aired}\n`
                    txt += `Producers : ${get_result.producers}\n`
                    txt += `Genre : ${get_result.genres}\n`
                    txt += `Duration : ${get_result.duration}\n`
                    txt += `Studios : ${get_result.status}\n`
                    txt += `Rating : ${get_result.rating}\n`
                    txt += `Credit : ${get_result.credit}\n`
                    get_link = get_result.link_dl
                    for (var x in get_link) {
                        txt += `\n\n*${get_link[x].title}*\n`
                        for (var y in get_link[x].link_dl) {
                            info = get_link[x].link_dl[y]
                            txt += `\n\`\`\`Reso : \`\`\`${info.reso}\n`
                            txt += `\`\`\`Size : \`\`\`${info.size}\n`
                            txt += `\`\`\`Link : \`\`\`\n`
                            down_link = info.link_dl
                            for (var z in down_link) {
                                txt += `${z} - ${down_link[z]}\n`
                            }
                        }
                    }
                    reply(txt)
                    break
                case 'otakudesusearch':
                    query = args.join(" ")
                    get_result = await fetchJson(`https://lolhuman.herokuapp.com/api/otakudesusearch?apikey=${apikey}&query=${query}`)
                    get_result = get_result.result
                    txt = `Title : ${get_result.title}\n`
                    txt += `Japanese : ${get_result.japanese}\n`
                    txt += `Judul : ${get_result.judul}\n`
                    txt += `Type : ${get_result.type}\n`
                    txt += `Episode : ${get_result.episodes}\n`
                    txt += `Aired : ${get_result.aired}\n`
                    txt += `Producers : ${get_result.producers}\n`
                    txt += `Genre : ${get_result.genres}\n`
                    txt += `Duration : ${get_result.duration}\n`
                    txt += `Studios : ${get_result.status}\n`
                    txt += `Rating : ${get_result.rating}\n`
                    txt += `Credit : ${get_result.credit}\n`
                    get_link = get_result.link_dl
                    for (var x in get_link) {
                        txt += `\n\n*${get_link[x].title}*\n`
                        for (var y in get_link[x].link_dl) {
                            info = get_link[x].link_dl[y]
                            txt += `\n\`\`\`Reso : \`\`\`${info.reso}\n`
                            txt += `\`\`\`Size : \`\`\`${info.size}\n`
                            txt += `\`\`\`Link : \`\`\`\n`
                            down_link = info.link_dl
                            for (var z in down_link) {
                                txt += `${z} - ${down_link[z]}\n`
                            }
                        }
                    }
                    reply(txt)
                    break
                case 'sticker':
                    if ((isMedia && !lol.message.videoMessage || isQuotedImage) && args.length == 0) {
                        const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(lol).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : lol
                        const media = await lolhuman.downloadAndSaveMediaMessage(encmedia)
                        const ran = getRandom('.webp')
                        await ffmpeg(`./${media}`)
                            .input(media)
                            .on('start', function(cmd) {
                                console.log(`Started : ${cmd}`)
                            })
                            .on('error', function(err) {
                                console.log(`Error : ${err}`)
                                fs.unlinkSync(media)
                                reply(mess.error.stick)
                            })
                            .on('end', function() {
                                console.log('Finish')
                                buff = fs.readFileSync(ran)
                                lolhuman.sendMessage(from, buff, sticker, { quoted: lol })
                                fs.unlinkSync(media)
                                fs.unlinkSync(ran)
                            })
                            .addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                            .toFormat('webp')
                            .save(ran)

                    } else {
                        reply(`Kirim gambar dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim`)
                    }
                    break
                case 'igdl':
                    ini_url = args[0]
                    ini_url = await fetchJson(`https://lolhuman.herokuapp.com/api/instagram?apikey=${apikey}&url=${ini_url}`)
                    ini_url = ini_url.result
                    ini_type = image
                    if (ini_url.includes(".mp4")) ini_type = video
                    buffer = await getBuffer(ini_url)
                    lolhuman.sendMessage(from, buffer, ini_type, { quoted: lol })
                    break
                case 'fbdl':
                    ini_url = args[0]
                    ini_url = await fetchJson(`https://lolhuman.herokuapp.com/api/facebook?apikey=${apikey}&url=${ini_url}`)
                    ini_url = ini_url.result[0].link
                    buffer = await getBuffer(ini_url)
                    lolhuman.sendMessage(from, buffer, video, { quoted: lol })
                    break
                case 'ytplay':
                    query = args.join(" ")
                    get_result = await fetchJson(`https://lolhuman.herokuapp.com/api/ytplay?apikey=${apikey}&query=${query}`)
                    get_result = get_result.result
                    get_info = get_result.info
                    txt = `Title : ${get_info.title}\n`
                    txt += `Uploader : ${get_info.uploader}\n`
                    txt += `Duration : ${get_info.duration}\n`
                    txt += `View : ${get_info.view}\n`
                    txt += `Like : ${get_info.like}\n`
                    txt += `Sislike : ${get_info.dislike}\n`
                    txt += `Description :\n ${get_info.description}\n`
                    buffer = await getBuffer(get_info.thumbnail)
                    lolhuman.sendMessage(from, buffer, image, { quoted: lol, caption: txt })
                    get_audio = await getBuffer(get_result.audio[3].link)
                    lolhuman.sendMessage(from, get_audio, audio, { quoted: lol })
                    get_video = await getBuffer(get_result.video[0].link)
                    lolhuman.sendMessage(from, get_video, video, { quoted: lol })
                    break
                case 'pinterestdl':
                    ini_url = args[0]
                    ini_url = await fetchJson(`http://lolhuman.herokuapp.com/api/pinterestdl?apikey=${apikey}&url=${ini_url}`)
                    ini_url = ini_url.result["736x"]
                    buffer = await getBuffer(ini_url)
                    lolhuman.sendMessage(from, buffer, image, { quoted: lol })
                    break
                case 'broadcast':
                    list_chat = await lolhuman.chats.all()
                    ini_text = args.join(" ")
                    for (let chat of list_chat) {
                        sendMess(chat.jid, ini_text)
                    }
                    break
                default:
                    if (isCmd) {
                        reply(`Sorry bro, command *${prefix}${command}* gk ada di list *${prefix}help*`)
                    }
                    if (!isGroup && !isCmd) {
                        simi = await fetchJson(`https://lolhuman.herokuapp.com/api/simi?apikey=${apikey}&text=${pesan}`)
                        reply(simi.result)
                    }
            }
        } catch (e) {
            console.log(color(time, "white"), color("[  ERROR  ]", "aqua"), color(e, 'red'), color("in", "red"), color(e.line, "red"))
        }
    })
}
starts()