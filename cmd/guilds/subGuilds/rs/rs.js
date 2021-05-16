const fs = require("fs")
const { client } = require("../../../../managers/eventsManagers")
const badword = require("../../../../badword.json")

module.exports = async(message, id, msg) => {
    switch(id) {
        case "1": {
            // rank supérieur
            const guildList = require("../../../../guild.json")
            const data = require(`../../../../data/${message.author.id}.json`)
            if (!data || !guildList) return msg.edit({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue```" } })
            const guild = guildList.find(e => e.id == data.guild.id)
            if (!guild) return msg.edit({ embed: { color: "#2C2F33", description: "```\nJe n'ai pas trouvé la guild, merci de contacter un administrateur```" } })
            if (guild.rank >= 5) return msg.edit({ embed: { color: "#2C2F33", description: "```\nCette guild a atteint le rang maximal !```" }})
            if (guild.createdTimestamp + 604800000 > Date.now()) return msg.edit({ embed: { color: "#2C2F33", description: "```\nTa guild doit avoir été créée depuis une semaine !```" } })
            if (guild.members.length < 2) return msg.edit({ embed: { color: "#2C2F33", description: "```\nTa guild ne possède pas assez de membres !```" } })
            if (guild.lvl < 20) return msg.edit({ embed: { color: "#2C2F33", description: "```\nCette guild n'est pas au niveau 20, merci de revenir quand la guild auras atteint le niveau 20```" } })
            const index = guildList.findIndex(e => e.id == guild.id)
            if (index < 0) returnmsg.edit({ embed: { color: "#2CF233", description: "```\nUne erreur est survenue !```" } })
            guildList[index].rank++
            guildList[index].lvl = 1
            guildList[index].pts.pgm -= 2000
            guildList[index].pts.pgg += guildList[index].pts.pgm
            guildList[index].pts.pgm = 0
            fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))
            msg.edit({ embed: { color: "#2C2F33", description: `**Félicitation ${message.author.tag}, ta guild est passé au rank supérieur !!!**` } })
            client.channels.cache.get("836498657963671562").send({ embed: {
                color: "#2C2F33",
                description: `\`\`\`\nLa guild "${guild.name}" est passé au rank ${guildList[index].rank} !!\`\`\``
            }})
        };
        case "2": {
            // xp +5%
            const guildList = require("../../../../guild.json")
            const data = require(`../../../../data/${message.author.id}.json`)
            if (!guildList || !data) return msg.edit({ embed : { color: "#2CF233", description: "```\nUne erreur est survenue```"} })
            const guild = guildList.find(e => e.id == data.guild.id)
            if (!guild) return msg.edit({ embed : { color: "#2CF233", description: "```\nJe n'ai pas trouver la guild, merci de contacter un administrateur```"} })
            if (guild.members.length < 5) return msg.edit({ embed: { color: "#2CF233", description: "```\nIl n'y a pas assez de personnes dans la guild !```" } })
            if (guild.bonus.xp >= 1.20) return msg.edit({ embed: { color: "#2C2F33", description: "```\nLa limite de pourcentage d'xp gagnée en plus a été atteinte !```" } })
            if (guild.pts.pgm < 20000) return msg.edit({ embed: { color: "#2C2F33", description: "```\nTa guild ne possède pas assez de pgm```" } })
            const index = guildList.findIndex(e => e.id == guild.id)
            if (!index) return msg.edit({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue```" } })
            if (guild.bonus.xp <= 1.15) { guildList[index].bonus.xp += 0.05 }
                else { guildList[index].bonus.xp = 1.20 }
            guildList[index].pts.pgm -= 20000
            fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))
            msg.edit({ embed: { color: "#2C2F33", description: "```\nLes membres de ta guild auront désormais un bonus de "+ Math.floor(( guildList[index].bonus.xp - 1 ) * 100) + "% pour l'xp gagnée ```" } })
        };
        case "3": {
            // money +5%
            const guildList = require("../../../../guild.json")
            const data = require(`../../../../data/${message.author.id}.json`)
            if (!guildList || !data) return msg.edit({ embed : { color: "#2CF233", description: "```\nUne erreur est survenue```"} })
            const guild = guildList.find(e => e.id == data.guild.id)
            if (!guild) return msg.edit({ embed : { color: "#2CF233", description: "```\nJe n'ai pas trouver la guild, merci de contacter un administrateur```"} })
            if (guild.members.length < 5) return msg.edit({ embed: { color: "#2CF233", description: "```\nIl n'y a pas assez de personnes dans la guild !```" } })
            if (guild.bonus.money >= 1.20) return msg.edit({ embed: { color: "#2C2F33", description: "```\nLa limite de pourcentage d'argent gagnée en plus a été atteinte !```" } })
            if (guild.pts.pgm < 20000) return msg.edit({ embed: { color: "#2C2F33", description: "```\nTa guild ne possède pas assez de pgm```" } })
            const index = guildList.findIndex(e => e.id == guild.id)
            if (!index) return msg.edit({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue```" } })
            if (guild.bonus.money <= 1.15) { guildList[index].bonus.money += 0.05 }
                else { guildList[index].bonus.money = 1.20 }
            guildList[index].pts.pgm -= 20000
            fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))
            msg.edit({ embed: { color: "#2C2F33", description: "```\nLes membres de ta guild auront désormais un bonus de "+ Math.floor(( guildList[index].bonus.money - 1 ) * 100) + "% pour l'argent gagnée ```" } })
        };
        case "4": {
            // pgm +1%
            const guildList = require("../../../../guild.json")
            const data = require(`../../../../data/${message.author.id}.json`)
            if (!guildList || !data) return msg.edit({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue```" } })
            const guild = guildList.find(e => e.id == data.guild.id)
            if (!guild) return msg.edit({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue, merci de contacter un administrateur" } })
            if (guild.createdTimestamp + 1296000000 > Date.now()) return msg.edit({ embed: { color: "#2C2F33", description: "```\nTa guild est trop récente```" } })
            if (guild.members.length < 4) return msg.edit({ embed: { color: "#2C2F33", description: "```\nIl n'y a pas assez de membres dans ta guild !```" } })
            if (guild.pts.pgm < 20000) return msg.edit({ embed: { color: "#2C2F33", description: "```\nTa guild ne possède pas assez de pgm" } })
            if (guild.bonus.pgm >= 1.20) return msg.edit({ embed: { color: "#2C2F33", description: "```" } })
            const index = guildList.findIndex(e => e.id == data.guild.id)
            if (index < 0) return msg.edit({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue```" } })
            guildList[index].pts.pgm -= 10000
            guildList[index].bonus.pgm += 0.01
            fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))
            msg.edit({ embed: { color: "#2C2F33", description: `\`\`\`\nDésormais, ta guild possède un bonus de ${Math.trunc((guildList[index].bonus.pgm - 1) * 100)}% pour le gains de points ( + 1% )\`\`\`` } })
        };
        case "5": {
            // description
            const guildList = require("../../../../guild.json")
            const data = require(`../../../../data/${message.author.id}.json`)
            if (!data || !guildList ) return msg.edit({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue```" } })
            let guild = guildList.find(e => e.id == data.guild.id)
            if (!guild) return msg.edit({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue, merci de contacter un administrateur```" } })
            if (guild.members.length < 2) return msg.edit({ embed: { color: "#2C2F33", description: "```\nTa guild ne possède pas assez de membres```" } })
            if (guild.pts.pgm < 1000) return msg.edit({ embed: { color: "#2C2F33", description: "```\nTa guild ne possède pas assez de pgm```" } })
            const index = guildList.findIndex(e => e.id == guild.id)
            if (index < 0) return msg.edit({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue```" } })
            msg.edit({ embed: { color: "#2C2F33", description: "> **Quel est la nouvelle description de ta guild ?**\n\n*PS : si dans 60s, tu n'a pas donné la description, tu ne seras pas facturé et tu pourras refaire l'achat*" } })
            let response = false
            const collector = message.channel.createMessageCollector((m) => m.author.id == message.author.id && m.content.length > 0, { time: 60000 })
            collector.on("collect", (m) => {
                if (m.content.length < 1) return
                if (m.content.length >= 250) return msg.channel.send({ embed: { color: "#2C2F33", description: "```\nLa description doit contenir moins de 250 caractères```" } })
                const a = m.content.trim().toLowerCase().split(/\s+/g)
                if (badword.some(e => a.includes(e))) return message.channel.send("❌ **J'ai détecter un mot vulgaire dans la description, ressaye en retirant ce(s) mot(s) !**")
                response = true
                guildList[index].description = m.content
                guildList[index].pts.pgm -= 1000
                fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))
                msg.edit({ embed: { color: "#2C2F33", description: `**La nouvelle description est désormais :**\n\`\`\`\n${guildList[index].description}\`\`\`` } })
                collector.stop()
            })
            collector.on('end', () => {
                if (!response) msg.edit({ embed: { color: "#2C2F33", description: "```\nLe temps est écoulé, aucun pgm ne te seras facturé et tu peux refaire l'achat```" } })
            })
        };
        case "6": {
            // icon
            const guildList = require("../../../../guild.json")
            const data = require(`../../../../data/${message.author.id}.json`)
            if (!data || !guildList ) return msg.edit({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue```" } })
            let guild = guildList.find(e => e.id == data.guild.id)
            if (!guild) return msg.edit({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue, merci de contacter un administrateur```" } })
            if (guild.members.length < 3) return msg.edit({ embed: { color: "#2C2F33", description: "```\nTa guild ne possède pas assez de membres```" } })
            if (guild.pts.pgm < 500) return msg.edit({ embed: { color: "#2C2F33", description: "```\nTa guild ne possède pas assez de pgm```" } })
            const index = guildList.findIndex(e => e.id == guild.id)
            if (index < 0) return msg.edit({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue```" } })
            msg.edit({ embed: { color: "#2C2F33", description: "> **Quel est la nouvelle icon de ta guild ?**\n\n*PS : si dans 60s, tu n'a pas donné un lien, tu ne seras pas facturé et tu pourras refaire l'achat*" } })
            let response = false
            const collector = message.channel.createMessageCollector((m) => m.author.id == message.author.id && m.content.length > 0, { time: 60000 })
            collector.on("collect", (m) => {
                if (m.content.length < 1) return
                response = true
                guildList[index].icon = m.content.trim()
                guildList[index].pts.pgm -= 500
                fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))
                msg.edit({ embed: { color: "#2C2F33", description: `**La nouvelle icon est désormais :**`, image: { url: guildList[index].icon } } })
                collector.stop()
            })
            collector.on('end', () => {
                if (!response) msg.edit({ embed: { color: "#2C2F33", description: "```\nLe temps est écoulé, aucun pgm ne te seras facturé et tu peux refaire l'achat```" } })
            })
        };
    }
    await deleteCache([`../../../../data/${message.author.id}.json`, "../../../../guild.json"])
}