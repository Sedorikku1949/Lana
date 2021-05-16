const fs = require("fs")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!args[0]) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nTu dois me donner une description pour ton profile```" } })
        await ensure(message.author)
        let data = require(`../../data/${message.author.id}.json`)
        if (!data) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nUn problème est survenue```" } })
        data.bio.desc = message.content.slice(prefix.length + command.length + 1).trim().replace("`", "`\u200b")
        fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
        await deleteCache([`../../data/${message.author.id}.json`])
        return message.channel.send({ embed: { color: "#2C2F33", description: "> **Ta description est désormais:**\n```\n" + data.bio.desc + "```" } })
    },
    config: {
        name: "bio", aliases: ["desc", "description"], category: "info", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Tu peux modifier ta biographie de ton profile :D", use: "=bio <description>" }, modules: []
    }
};