const fs = require("fs")

module.exports = async(message, guild, guildList, question) => {
    await question.edit({ embed: { color: "#2C2F33", description: "**Quel est le lien d'invitation de la guild ?**" } })
    const c = message.channel.createMessageCollector((m) => m.author.id === message.author.id, { time: 60000 })
    c.on("collect", async(msg) => {
        const serv = msg.content
        if (!serv.match(/(https?:\/\/)?(www.)?(discord.(gg|io|me|li)|discordapp.com\/invite)\/.+[a-z]/gi)) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nCe n'est pas une invitation valide.```" }})
        const index = guildList.findIndex(e => e.id == guild.id)
        if (index < 0) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue.```" }})
        guildList[index].server = serv
        fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))
        await message.channel.send({ embed: { color: "#2C2F33", description: `**Le serveur de la guild est désormais "${serv}" !**` } })
        await deleteCache([`../../../../guild.json`])
        c.stop()
    })
    c.on("end", () => question.delete().catch(() => false))
}