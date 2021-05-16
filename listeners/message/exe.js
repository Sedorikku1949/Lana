const { client } = require("../../managers/eventsManagers")
const fs = require("fs")
const getRankLvl = require("../../functions/guilds/getRankLvl")

async function sendMp(message) {
    if (message.content && message.content.length > 0) {
        await client.channels.cache.get("796377851997192213").send({ embed: {
            color: "#2C2F33",
            title: `mp de ${message.author.username}`,
            description: message.content,
            footer: { text: message.author.id }
        }})
    }
    message.attachments.forEach(async(e) => {
        await client.channels.cache.get("796377851997192213").send("> **A attachments was send with the message of "+message.author.tag+" :**", { files: [{attachment: e.url, name: e.name}] })
    })
}

module.exports = async(message) => {
    if (message.webhookID) return require("../../functions/app/voteAnalyse")(message)
    if (message.author.bot) return
    if (message.channel.type == "dm") return sendMp(message)
    if (!message.content) return
    
    await ensure(message.author)
    require("../../managers/commandsManager").execute(message)
    require("./automod")(message)
    require("../../functions/app/stats")(message)

    if (message.guild.id !== "782235567970713620") return
    let data = require(`../../data/${message.author.id}.json`)
    if (!data) return console.log("base de donnée de l'utilisateur" + message.author.username + " introuvable")

    if (!data.xp.cooldown) data.xp.cooldown = Date.now() - (60 * 1000)

    const guildBonus = require("../../functions/guilds/bonus")

    if (data.xp.cooldown <= Date.now()) {
        let bonus = require("../../guild.json").find(e => e.id == data.guild.id)
        bonus = bonus ? bonus.bonus.xp : 1
        data.xp.xp += Number(guildBonus("xp", (Math.floor(Math.random() * 25) + 5), bonus ))
        data.xp.cooldown = Date.now() + (60 * 1000)

        let guildList = require("../../guild.json")
        let guild = guildList.find(e => e.id == data.guild.id)
        if (guild) {
            const index = guildList.findIndex(e => e.id == data.guild.id)
            const a = Math.floor(Math.random() * 11) + 2
            guildList[index].pts.pgm += a
            fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))
            await deleteCache([`../../guild.json`])
        }

        if (message.member.roles.cache.has("782235568012001285") && !data.bio.badges.find(e => e == "4")) data.bio.badges.push("4")
        if (data.bio.marryID && !data.bio.badges.find(e => e == "1")) data.bio.badges.push("1")
        if (data.bio.marryID && message.guild.members.cache.get(data.bio.marryID).roles.cache.has("782235568012001285") && !data.bio.badges.find(e => e == "6")) data.bio.badges.push("6")
        await fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
        await deleteCache([`../../data/${message.author.id}.json`])
    }

    if ((5 / 6) * data.xp.lvl * (2 * data.xp.lvl * data.xp.lvl + 27 * data.xp.lvl + 91) + 100 <= data.xp.xp) {
        data.xp.lvl++
        if (data.xp.lvl > 30  && !data.bio.badges.find(e => e == "2")) data.bio.badges.push("2")
        await fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
        await deleteCache([`../../data/${message.author.id}.json`])
        message.channel.send(`> **Félicitations \`${message.author.tag}\` ! tu passe au niveau \`${data.xp.lvl}\`**`)

        if (data.xp.lvl >= 2) message.member.roles.add("782235568003874818").catch(() => false)
        if (data.xp.lvl >= 5) message.member.roles.add("782235568003874819").catch(() => false)
        if (data.xp.lvl >= 10) message.member.roles.add("782235568003874820").catch(() => false)
        if (data.xp.lvl >= 15) message.member.roles.add("782235568003874821").catch(() => false)
        if (data.xp.lvl >= 20) message.member.roles.add("782235568003874822").catch(() => false)
        if (data.xp.lvl >= 30) message.member.roles.add("782235568003874823").catch(() => false)
     }

     let guildList = require("../../guild.json")
     let guild = guildList.find(e => e.id == data.guild.id)
     if (!guild) return
     if (getRankLvl()[guild.rank] && (getRankLvl()[guild.rank][guild.lvl] <= guild.pts.pgm)) {
         const index = guildList.findIndex(e => e.id == guild.id)
         if (index < 0) return
         // rank supérieur de guild
         if (guild.lvl !== 20) {
             guildList[index].lvl++
             fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))
             await deleteCache([`../../guild.json`])
             message.channel.send({ embed: { description: "```"+`Ta guild est passé au niveau ${guildList[index].lvl} !`+"```", color: "#2C2F33" } })
         } else {
             if (!guild.rankRappel) return
             guildList[index].rankRappel = true
             fs.writeFileSync('guild.json', JSON.stringify(guildList, null, 1))
             await deleteCache([`../../guild.json`])
             message.channel.send({ embed: { color: "#2C2F33", description: "```\n"+"Ta guild peut passé au rang supérieur, contacte le responsable de la guild !"+"```" } })
         }
     }
}