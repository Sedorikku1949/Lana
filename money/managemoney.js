const fs = require("fs")
const b = require("../../functions/guilds/bonus")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!args[0]) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nUn argument est requis```" } })
        const user = message.guild.members.cache.select(message.content.slice(prefix.length + command.length + 1).trim(), false, false, false)
        if (!user) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nJe n'ai pas trouver cette personne```" } })
        let data = false
        try { data = require(`../../data/${user.id}.json`) } catch(err) {}
        if (!data) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nCette personne n'est pas dans la base de donnée```" } })
        const question = await message.channel.send({ embed: { color: "#2C2F33", description: "> **Quelle action veux tu effectuer ?**\n```\nadd\nremove\nreset```" } })
        const collector = message.channel.createMessageCollector((user) => user.id !== message.author.id, { time: 60000 })
        collector.on("collect", async(msg) => {
            if (!["add", "remove", "reset"].includes(msg.content.toLowerCase())) return
            switch(msg.content.toLowerCase()) {
                case "add": {
                    await msg.delete()
                    require("./subMoney/addMoney")(message, args, modules, prefix, command, question, data, user);
                    collector.stop();
                    break;
                }
                case "remove": {
                    await msg.delete()
                    require("./subMoney/removeMoney")(message, args, modules, prefix, command, question, data, user);
                    collector.stop();
                    break;
                }
                case "reset": {
                    const ensure = require("../../config.json").ensure
                    fs.writeFileSync(`data/${user.id}.json`, JSON.stringify(ensure, null, 1))
                    message.channel.send({ embed: { color: "#2C2F33", description: `> **La base de donnée de ${user.user.tag} as été reset avec succès**` } })
                }
            }
        })
        collector.on("end", () => false)
    },
    config: {
        name: "managemoney", aliases: ["mm"], category: "eco", handler: { deleteInvoke: false, staff: true, dev: false, inPogress: false }, help: { desc: "Permet de gérer l'argent de quelqu'un", use: "=mm <user>" }, modules: []
    }
}