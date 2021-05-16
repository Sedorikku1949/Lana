const fs = require("fs")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        let data = require(`../../data/${message.author.id}.json`)
        // 
        const guildList = require("../../guild.json")
        let guild = guildList.find(e => e.id == data.guild.id)
        if (!guild) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nJe n'ai pas trouvé la guild```" } })
        const guildIndex = guildList.findIndex(e => e.id == guild.id)
        const index = guild.members.findIndex(e => e.id == message.author.id)
        if (index < 0) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue```" } })
        if (guild.responsable == message.author.id) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nTu es le responsable de la guild, tu ne peux pas la quitter```" } })

        guildList[guildIndex].members.splice(index, 1)
        data.guild.id = false

        fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify( data, null, 1 ))
        fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1 ))
        await deleteCache([`../../guild.json`, `../../data/${message.author.id}.json`])

        message.channel.send({ embed: { color: "#2C2F33", description: `**Tu n'es désormais plus dans la guild \`"${guild.name}"\` !**` } })
    },
    config: {
        name: "guildleave", aliases: ["gl"], category: "guild", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: true }, help: { desc: "Quitte sa guild", use: "Aucun argument requis" }, modules: []
    }
};