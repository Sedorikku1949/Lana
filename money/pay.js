const fs = require("fs")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!args[0] || !args[1]) return message.channel.send({ embed: { color: "#2C2F33", description: "```\n=pay user montant```" } })
        const user = message.guild.members.cache.select(args[0], false, false, false)
        if (!user) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nJe n'ai pas trouvé cette personne```" } })
        if (user.id == message.author.id) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nPourquoi faire un versement à toi même ?```" } })
        await ensure(message.author)
        await ensure(user)
        let secondData = require(`../../data/${user.id}.json`)
        let data = require(`../../data/${message.author.id}.json`)
        if (isNaN(args[1]) || args[1] < 0) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nLe montant est trop bas ou son format ne convient pas à la transaction```" } })
        const montant = Number(args[1])
        if (data.money.cash < montant) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nTu n'es pas assez riche pour donner ce montant```" } })

        data.money.cash -= montant
        secondData.money.cash += montant

        fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
        fs.writeFileSync(`data/${user.id}.json`, JSON.stringify(secondData, null, 1))
        await deleteCache([`../../data/${message.author.id}.json`, `../../data/${user.id}.json`])

        message.channel.send({ embed: { color: "#2C2F33", description: `\`\`\`\n"${montant}§" ont été verser à "${user.user.tag}" par "${message.author.tag}"\`\`\`` } })
        user.send({ embed: { color: "#2C2F33", author: { name:"Dring, ici votre banque du serveur The Last Kingdom Of Eden"}, description: `> **\`${montant}§\` vous ont été verser sur votre compte par \`${message.author.tag}\`**`, timestamp: Date.now() } }).catch(() => false)
    },
    config: {
        name: "pay", aliases: [], category: "eco", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Tu peux faire des virements à tes amis grâce à cette commande", use: "=pay <user>" }, modules: []
    }
}