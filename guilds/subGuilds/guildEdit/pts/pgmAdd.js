const fs = require("fs")

module.exports = async(message, guild, guildList, question) => {
    await question.edit({ embed: { color: "#2C2F33", description: "**Combien dois-je ajouter de pgm à cette guild ?**" } })
    const c = message.channel.createMessageCollector((m) => m.author.id === message.author.id, { time: 60000 })
    c.on("collect", async(msg) => {
        if (msg.content == "cancel") {
            await msg.react("✅")
            c.stop()
        }
        if (isNaN(msg.content)) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nTu dois donner un nombre valide```" } })
        const nb = Number(msg.content)
        const index = guildList.findIndex(e => e.id == guild.id)
        if (index < 0) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue.```" }})
        guildList[index].pts.pgm += nb
        fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))
        await deleteCache([`../../../../../guild.json`])
        await msg.delete()
        await message.channel.send({ embed: { color: "#2C2F33", description: `**La guild possède désormais ${guildList[index].pts.pgm} pgm ( +${nb} )**` } })
        c.stop()
    })
    c.on("end", () => question.delete().catch(() => false))
}