const fs = require("fs")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!args[0]) return message.channel.send({ embed: { color: "#2C2F33", description: "**Tu dois spécifier sur quelle guild tu veux effectuer une action**" }})
        const guildList = require("../../guild.json")
        const guild = guildList.find(e => e.name.toLowerCase().includes( message.content.slice(prefix.length+command.length+1).trim().toLowerCase() ) || e.id == message.content.slice(prefix.length+command.length+1).trim().toLowerCase())
        if (!guild) return message.channel.send({ embed: { color: "#2C2F33", description: "**Je n'ai pas trouver la guilde souhaitée**" } })
        
        let question = await message.channel.send({ embed: { color: "#2C2F33", description: "**Quel action veux tu executer ?**\n```\nedit\ndelete\nsee ( pour les devs )\n```" } })
        const collector = message.channel.createMessageCollector((user) => user.id !== message.author.id, { time: 60000 })

        collector.on("collect", async(msg) => {
            if (!["edit", "delete", "see", "cancel"].includes(msg.content.toLowerCase())) return
            if (msg.content == "cancel") {
                await msg.react("✅")
                collector.stop()
            }
            switch(msg.content.toLowerCase()) {
                case "edit": {
                    await msg.delete()
                    require("./subGuilds/editGuild")(message, question, guild, guildList)
                    collector.stop()
                    break;
                };
                case "delete": {
                    guild.members.forEach(async(e) => {
                        const data = require(`../../data/${e.id}.json`)
                        if (!data) return
                        data.guild.id = false
                        fs.writeFileSync(`data/${e.id}.json`, JSON.stringify(data, null, 1))
                    })
                    const index = guildList.findIndex(e => e.id == guild.id)
                    if (index < 0) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nUne erreur est survenue```" } })
                    guildList.splice(index, 1)
                    fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))
                    message.channel.send({ embed: { color: "#2C2F33", description: `La guild **${guild.name}** a bien été supprimée !` } })
                    collector.stop()
                    break;
                };
                case "see": {
                    // afficher la bdd
                    await question.delete()
                    await message.delete()
                    message.channel.send({ embed: { color: "#2C2F33", description: "```js\n"+require("util").inspect(guild)+"```" } })
                    collector.stop()
                    break;
                }
            }
        })
        collector.on("end", () => "")
    },
    config: {
        name: "manageguild", aliases: ["mg"], category: "guild", handler: { deleteInvoke: false, staff: true, dev: false, inPogress: true }, help: { desc: "Permet de gérer les guilds", use: "Rien à mettre dans la commande de départ mais il va y avoir des questions" }, modules: []
    }
};


/**
 * 
 */
