const { client, start } = require("../../managers/eventsManagers")
const rolemenu = require("../rolemenu.json")
const statut = require("../../functions/app/statut")
const fs = require("fs")
const getDate = require("../../functions/utils/getDate")
const chalk = require("chalk")

async function getReactedUsers(msg, channelID, messageID, emoji) {
    return new Promise( async (resolve, reject) => {
        let cacheChannel = msg.guild.channels.cache.get(channelID); 
        if(cacheChannel){
            const a = await cacheChannel.messages.fetch(messageID).then(reactionMessage => {
                return reactionMessage.reactions.resolve(emoji).users.fetch().then(userList => {
                    return userList;
                });
            });
            resolve(a)
        };
    })
};

module.exports = async () => {
    console.log(`The Application "${client.user.username}" has been successfully loaded.`)
    console.log(chalk.green(`Starting in ${Date.now() - start}ms`))

    // invites
    client.invites = await client.guilds.cache.get("782235567970713620").fetchInvites()

    // statut
    statut()

    // rolemenu
    rolemenu.forEach(async (e) => {
        const chl = client.channels.cache.get(e.channel)
        e.rm.forEach((b) => {
            chl.messages.fetch(b.id).catch(() => 0)
        })
    })
    console.log("role-menu loaded succesfully")

    // stats
    setInterval(async() => {
        const data = require("../../stats.json")
        const date = getDate(Date.now(), "[DD][MM][YYYY]")
        // global
        if (!data.global[date]) data.global[date] = client.stats.global[date]
        if (client.stats.global[date] > 0) data.global[date] = data.global[date] + client.stats.global[date]

        // user
        Object.entries(client.stats.user).forEach((e) => {
            Object.entries(e[1]).forEach((a) => {
                if (!data.user[e[0]]) data.user[e[0]] = {}
                if (!data.user[e[0]][a[0]]) data.user[e[0]][a[0]] = 0
                if (client.stats.user[e[0]][a[0]] > 0) data.user[e[0]][a[0]] = data.user[e[0]][a[0]] + client.stats.user[e[0]][a[0]]
            })
        })
        // channel
        Object.entries(client.stats.channel).forEach((e) => {
            Object.entries(e[1]).forEach((a) => {
                if (!data.channel[e[0]]) data.channel[e[0]] = {}
                if (!data.channel[e[0]][a[0]]) data.channel[e[0]][a[0]] = 0
                if (client.stats.channel[e[0]][a[0]] > 0) data.channel[e[0]][a[0]] = data.channel[e[0]][a[0]] + client.stats.channel[e[0]][a[0]]
            })
        })
        // join
        if (!data.join[date]) data.join[date] = 0
        if (client.stats.join[date] > 0) data.join[date] = data.join[date] + client.stats.join[date]
        // leave
        if (!data.leave[date]) data.leave[date] = 0
        if (client.stats.leave[date] > 0) data.leave[date] = data.leave[date] + client.stats.leave[date]
        
        fs.writeFileSync("stats.json", JSON.stringify(data, null, 1))
        client.stats = { global: {}, user: {}, channel: {}, join: {}, leave: {}, vocal: {}}
    }, 10 * 60 * 1000)

    
    setInterval(async () => {
        // mute
        fs.readdirSync("data").forEach(async(dir) => {
            if (!dir.endsWith(".json")) return
            let dataMute = require(`../../data/${dir}`)
            if (dataMute.sanctions.mute.length <= 0) return
            const mute = dataMute.sanctions.mute.filter(e => (e.date + e.time) - Date.now() <= 0 && !e.unmute)
            if (mute.length <= 0) return
            mute.forEach(async (e) => {
                const member = client.guilds.cache.get("782235567970713620").members.cache.get(dataMute.id)
                if (!member || !member.roles.cache.has("782614716811706369")) return
                member.roles.remove("782614716811706369").catch(() => 0)
                member.send({ embed: { color: '#FF6565', title: "Tu a été démute après le temps impartie !" } }).catch(() => 0)
                const index = mute.findIndex(a => a.id == e.id)
                if (index < 0) return
                dataMute.sanctions.mute[index].unmute = true
            })
            fs.writeFileSync(`data/${dir}`, JSON.stringify(dataMute, null, 1))
            await deleteCache([`../../data/${dir}`])
        })

        // mp money cooldown
        fs.readdirSync("data").forEach(async(dir) => {
            if (!dir.endsWith(".json")) return
            if ( !require("../../mp.json")[dir.replace(".json", "")] ) return
            let data = require(`../../data/${dir}`)
            const user = client.users.cache.get(dir.replace(".json", ""))
            if (!data || !user) return
            if (!data.money.rappel) data.money.rappel = { work: false, fish: false, daily: false, hebdo: false, hourly: false }
            let msgToSend = []
            if (data.money.work <= Date.now() && !data.money.rappel.work ) { msgToSend.push({ name: "La commande de work est prête !", value: `prête le ${getDate(data.money.work, `[DD]/[MM]/[YYYY] à [hh]:[mm]`)}`, inline: false}) ; data.money.rappel.work = true }
            if (data.money.fish <= Date.now() && !data.money.rappel.fish ) { msgToSend.push({ name: "La commande de fish est prête !", value: `prête le ${getDate(data.money.fish, `[DD]/[MM]/[YYYY] à [hh]:[mm]`)}`, inline: false}) ; data.money.rappel.fish = true }
            if (data.money.daily <= Date.now() && !data.money.rappel.daily ) { msgToSend.push({ name: "La commande de daily est prête !", value: `prête le ${getDate(data.money.daily, `[DD]/[MM]/[YYYY] à [hh]:[mm]`)}`, inline: false}) ; data.money.rappel.daily = true }
            if (data.money.hebdo <= Date.now() && !data.money.rappel.hebdo ) { msgToSend.push({ name: "La commande de hebdo est prête !", value: `prête le ${getDate(data.money.hebdo, `[DD]/[MM]/[YYYY] à [hh]:[mm]`)}`, inline: false}) ; data.money.rappel.hebdo = true }
            if (data.money.hourly <= Date.now() && !data.money.rappel.hourly ) { msgToSend.push({ name: "La commande de hourly est prête !", value: `prête le ${getDate(data.money.hourly, `[DD]/[MM]/[YYYY] à [hh]:[mm]`)}`, inline: false}) ; data.money.rappel.hourly = true }
            if (msgToSend.length < 1) return
            user.send({ embed: {
                color: "#2C2F33",
                description: "**Drriiinng ! Ici le rappel de l'argent ! Tu peux faire des commandes d'économies.**",
                fields: msgToSend
            }}).catch(() => {
                client.channels.cache.get("782235571094945794").send(user, { embed: {
                    color: "#2C2F33",
                    description: "**Drriiinng ! Ici le rappel de l'argent ! Tu peux faire des commandes d'économies.**",
                    fields: msgToSend,
                    footer: { text: "Ce message a envoyé ici car je n'ai pas pu te mp" }
                }}).catch(() => false)
            })
            fs.writeFileSync(`data/${dir}`, JSON.stringify(data, null, 1))
            await deleteCache([`../../data/${dir}`])
        })

        // stats vocaux
        const guild = client.guilds.cache.get("782235567970713620")
        client.channels.cache.get("782542526162534451").setName(`• Tout le monde ➯ ${guild.memberCount}`)
        client.channels.cache.get("782542529476165652").setName(`• Les membres ➯ ${guild.memberCount - guild.members.cache.filter(e => e.user.bot).size}`)
        client.channels.cache.get("782542532676419584").setName(`• Les bots ➯ ${guild.members.cache.filter(e => e.user.bot).size}`)
    
        // events
        let eventFile = require("../../events.json")
        const eventToFinish = eventFile.filter(e => (e.date + e.time) <= Date.now())
        if (eventToFinish.length <= 0) return
        eventToFinish.forEach(async(e) => {
            eventFile = require("../../events.json")
            const channel = client.guilds.cache.get("782235567970713620").channels.cache.get(e.channel)
            const msg = await channel.messages.fetch(e.msg).catch(() => 0)
            if (!msg || !msg.reactions || !msg.reactions.cache.get("🎉")) return channel.send({ embed: { color: "#8B8BF7", description: "> **Un event a été lancé ici mais je n'ai pas retrouver le message ou il n'y avait pas de réactions**" } })
            
            await channel.messages.fetch(e.msg)
            const reactions = await getReactedUsers(channel.messages.cache.get(e.msg), e.channel, e.msg, '🎉')
            if (!reactions || reactions.length < 1) return channel.send({ embed: { color: "#8B8BF7", description: "> **Un event a été lancé ici mais je n'ai pas retrouver le message ou il n'y avait pas de réactions**" } })
            const winner = reactions.filter(user => !user.bot).random( (e.nb > 0 ? e.nb : 1) )
            
            await channel.send({ embed: {
                color: "#8B8BF7",
                description: `> **L'event "${e.name}" est terminé, nous avons ${winner.length} gagnants !**`,
                fields: [
                    { name: "**Gagnants :**", value: winner.length > 0 ? winner.join("\n") : "**`ERROR`**", inline: false }
                ]
            }})
            const index = eventFile.findIndex(a => a.msg == e.msg)
            if (index < 0) return
            eventFile.splice(index, 1)
            fs.writeFileSync("events.json", JSON.stringify(eventFile, null, 1))
            await deleteCache([`../../events.json`])
        })
    }, 60 * 1000)
}