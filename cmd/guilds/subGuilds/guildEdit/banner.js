const fs = require("fs")

module.exports = async(message, guild, guildList, question) => {
    await question.edit({ embed: { color: "#2C2F33", description: "**Quel seras la nouvelle bannière de la guild ?**" } })
    const c = message.channel.createMessageCollector((m) => m.author.id === message.author.id, { time: 60000 })
    c.on("collect", async(msg) => {
        if (msg.content == "cancel") return c.stop()
        const icon = msg.attachments.first()
        if (!icon) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nTu dois envoyer une image en fichiers joins```" } })
        const index = guildList.findIndex(e => e.id == guild.id)
        if (index < 0) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue.```" }})
        guildList[index].banner = icon.attachment
        fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))
        await deleteCache([`../../../../guild.json`])
        await msg.delete()
        await message.channel.send({ embed: { color: "#2C2F33", description: `**La bannière de la guild est désormais :**`, image: { url: icon.attachment } } })
        await question.delete()
        c.stop()
    })
    c.on("end", () => question.delete().catch(() => false))
}