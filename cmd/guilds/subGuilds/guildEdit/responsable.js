const fs = require("fs")
const { client } = require("../../../../managers/commandsManager")

module.exports = async(message, guild, guildList, question) => {
    await question.edit({ embed: { color: "#2C2F33", description: "**Qui seras le nouveau responsable de la guild ?**" } })
    const c = message.channel.createMessageCollector((m) => m.author.id === message.author.id, { time: 60000 })
    c.on("collect", async(msg) => {
        if (msg.content == "cancel") return c.stop()
        const responsable = message.guild.members.cache.select(msg.content, false, false, false)
        if (!responsable) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nJe n'ai pas trouvé le nouveau responsable```" } })
        const index = guildList.findIndex(e => e.id == guild.id)
        if (index < 0) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue.```" }})
        guildList[index].responsable = responsable
        fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))
        await deleteCache([`../../../../guild.json`])
        await message.channel.send({ embed: { color: "#2C2F33", description: `**Le(a) nouveau(elle) responsable de la guild ${guild.name} est désormais ${responsable} [ ${responsable.user.tag} ]**` } })
        c.stop()
    })
    c.on("end", () => question.delete().catch(() => false))
}