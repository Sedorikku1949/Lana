const { client } = require("../../managers/eventsManagers")
const fs = require("fs")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        await ensure(message.author)
        let data = require(`../../data/${message.author.id}.json`)
        if (!args[0]) return message.channel.send({ embed: { color: "#9EB7FF", description: "> **Je ne sais pas à qui tu veux faire ta demande**" } })
        const secondUser = message.guild.members.cache.select(args[0], false, false, false)
        if (!secondUser) return message.channel.send({ embed: { color: "#9EB7FF", description: "> **Je n'ai pas trouvé à qui tu veux faire ta demande**" } })
        if (secondUser.id == message.author.id) return message.channel.send({ embed: { color: "#9EB7FF", description: "> **Dame nature m'empeche de te marrier à toi même**" } })
        if (!data.guild.inv.includes("bague")) return message.channel.send({ embed: { color: "#9EB7FF", description: "> **Tu ne possède pas de bagues...**" } })
        await ensure(secondUser)
        let secondData = require(`../../data/${secondUser.id}.json`)
        let msg = await message.channel.send(secondUser, { embed: { color: "#9EB7FF", description: `> **Veux-tu épouser \`${message.author.tag}\` ?**` } })
        await msg.react("💖")
        await msg.react("💔")
        let end = false
        const collector = msg.createReactionCollector(() => true/*(user, react) => user.id == secondUser.id*/, { time: 120000 })
        collector.on("collect", async(react) => {
            if ( !["💖","💔"].includes(react.emoji.name) || !react.users.cache.find(e => e.id == secondUser.id) ) return
            switch(react.emoji.name) {
                case "💔": {
                    msg.delete()
                    data.bio.badges.push("8")
                    fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
                    message.channel.send(`**Désolé mais ${secondUser.user.tag} as refusé**`)
                    end = true
                    collector.stop()
                    // rip
                    break
                }
                case "💖": {
                    // gg
                    data.bio.marryID = secondUser.id
                    secondData.bio.marryID = message.author.id
                    const index = data.guild.inv.indexOf("bague")
                    data.guild.inv.splice(index, 1)

                    data.bio.badges.push("1")
                    secondData.bio.badges.push("1")

                    if (message.guild.members.cache.get(data.id).roles.cache.has("782235568012001285")) secondData.bio.badges.push("6")
                    if (message.guild.members.cache.get(secondData.id).roles.cache.has("782235568012001285")) data.bio.badges.push("6")

                    
                    fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
                    fs.writeFileSync(`data/${secondUser.id}.json`, JSON.stringify(secondData, null, 1))
                    await deleteCache([`data/${secondUser.id}.json`, `data/${message.author.id}.json`])

                    message.delete()
                    message.channel.send({ embed: { color: "#9EB7FF", description: `> 💍 **${secondUser.user.tag} et ${message.author.tag} sont maintenant unis par les liens du marriage !**` } })

                    end = true
                    collector.stop()
                    break
                }
            }
        })
        collector.on("end", () => {
            if (!end) { msg.delete(); message.channel.send(`**Désolé mais ${secondUser.user.tag} as mis trop de temps pour répondre**`) }
        })
    },
    config: {
        name: "marry", aliases: [], category: "info", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Tu peux enfin te marrier, alors achète une bague et fait ta demande !", use: "=marry <user>" }, modules: []
    }
};