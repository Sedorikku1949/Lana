const fs = require("fs")

module.exports = async(message, args, modules, prefix, command, question, data, user) => {
    question.edit({ embed: { color: "#2C2F33", description: "```\nCombien d'argent veux-tu ajouter à cette personne ?```" } })
    const collector = message.channel.createMessageCollector((u) => u.id !== message.author.id, { time: 60000 })
    collector.on('collect', async(msg) => {
        console.log(msg.content)
        console.log(isNaN(msg.content))
        if (isNaN(msg.content)) return msg.react("❌")
        const montant = Number(msg.content)
        data.money.cash += montant
        fs.writeFileSync(`data/${user.id}.json`, JSON.stringify(data, null, 1))
        await deleteCache([`../../data/${user.id}.json`])
        await msg.delete().catch(() => false)
        await question.edit({ embed: { color: "#2C2F33", description: "```\n"+`${montant}§ ont été ajouté(s) à "${user.user.tag}"`+"```" } }).catch(() => false)
        collector.stop()
    })
    collector.on("end", () => false)
}