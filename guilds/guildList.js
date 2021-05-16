const fs = require("fs")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        const guildList = require("../../guild.json")
        const desc = guildList.map(e => `[ **${e.name}** ] \n \`${e.members.length} membres\``).join("\n")
        message.channel.send({ embed: { color: "#2C2F33", description: desc, title: "Liste des guilds :" }})
    },
    config: {
        name: "guildlist", aliases: ["list"], category: "guild", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: true }, help: { desc: "La liste des guilds :D", use: "Aucun argument requis" }, modules: []
    }
};