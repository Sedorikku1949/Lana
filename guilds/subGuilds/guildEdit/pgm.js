module.exports = async(message, guild, guildList, question) => {
    await question.edit({ embed: { color: "#2C2F33", description: "**Veux tu ajouter ou retirer des pgm à cette guild ?**```\nadd\nremove```" } })
    const collector = message.channel.createMessageCollector((m) => ["add", "remove", "cancel"].includes(m.content.toLowerCase()) && m.author.id == message.author.id, { time: 60000 })
    collector.on("collect", async(msg) => {
        switch(msg.content.toLowerCase()) {
            case "add": {
                await msg.delete()
                require("./pts/pgmAdd")(message, guild, guildList, question)
                collector.stop()
                break
            }
            case "remove": {
                await msg.delete()
                require("./pts/pgmRemove")(message, guild, guildList, question)
                collector.stop()
                break
            }
        }
    })
    collector.on("end", () => false)
}