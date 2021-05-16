const fs = require("fs")

module.exports = async(message, guild, guildList, question) => {
    await question.edit({ embed: { color: "#2C2F33", description: "**Quel seras le nouveau nom ?**" } })
    const c = message.channel.createMessageCollector((m) => m.author.id === message.author.id, { time: 60000 })
    c.on("collect", async(msg) => {
        const newName = msg.content
        const index = guildList.findIndex(e => e.id == guild.id)
        if (index < 0) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue.```" }})
        guildList[index].name = newName
        fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))
        await deleteCache([`../../../../guild.json`])
        await message.channel.send({ embed: { color: "#2C2F33", description: `**Le nom de la guild est désormais "${newName}" !**` } })
        c.stop()
    })
    c.on("end", () => question.delete().catch(() => false))
}