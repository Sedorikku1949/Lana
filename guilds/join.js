const fs = require("fs")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!args[0]) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nTu dois spécifier quel guild tu veux rejoindre```" } })
        let data = require(`../../data/${message.author.id}.json`)
        if (!data) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nJe n'ai pas trouver ta base de donnée```" } })
        if (data.guild.id)  return message.channel.send({ embed: { color: "#2C2F33", description: "```\nTu es déjà dans une guild```" } })

        // 
        const search = message.content.slice(prefix.length + command.length + 1).trim().toLowerCase()
        const guildList = require("../../guild.json")
        let guild = guildList.find(e => e.name.toLowerCase().includes(search) || e.id == search)
        if (!guild) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nJe n'ai pas trouvé la guild```" } })
        console.log(guild.members.length)
        console.log(guild.rank)
        console.log(guild.rank * 5)
        if (guild.members.length >= (guild.rank * 5)) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nCette guild ne peut pas accueillir quelqu'un d'autre actuellement```" } })
        const guildIndex = guildList.findIndex(e => e.id == guild.id)
        if (guildIndex < 0) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue```" } })

        guildList[guildIndex].members.push({ rank: "member", id: message.author.id})
        data.guild.id = guild.id

        fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify( data, null, 1 ))
        fs.writeFileSync("guild.json", JSON.stringify( guildList, null, 1 ))
        await deleteCache([`../../guild.json`, `../../data/${message.author.id}.json`])

        message.channel.send({ embed: { color: "#2C2F33", description: `**Tu es désormais dans la guild \`"${guild.name}"\` !**` } })
    },
    config: {
        name: "guildjoin", aliases: ["gj"], category: "guild", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: true }, help: { desc: "Tu veux rejoindre une guild ?", use: "=gj <guild>" }, modules: []
    }
};