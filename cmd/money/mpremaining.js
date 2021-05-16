const fs = require("fs")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        const mp = require("../../mp.json")
        if (!mp[message.author.id]) mp[message.author.id] = false
        const before = mp[message.author.id]
        if (!mp[message.author.id]) mp[message.author.id] = true
        else mp[message.author.id] = false
        fs.writeFileSync("mp.json", JSON.stringify(mp, null, 1))
        message.channel.send({ embed: { color: "#2C2F33", description: "```\n"+`Tu ${before ? "ne": "\u200b"} recevras ${before ? "plus": "\u200b"} des mp quand les commandes de money seront utilisables, tu peux ${before ? "activer": "désactiver"} en refaisant la commande`+"```" } })
    },
    config: {
        name: "mp", aliases: [], category: "eco", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Cette commande te permet d'avoir des rappels des commandes d'argents", use: "Aucun argument requis" }, modules: []
    }
}