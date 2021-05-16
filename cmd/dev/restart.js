const { client } = require("../../managers/eventsManagers")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        let msg = await message.channel.send({ embed: { color: "#2C2F33", description: "> <a:tk_load:826063567258124308> **Redémarrage du programme...**" } })
        client.destroy()
        delete require.cache
        client.login(require("../../config.json").token)
        await require("../../managers/eventsManagers")
        msg.edit({ embed: { color: "#2C2F33", description: "> **Redémarrage du programme réussi**" } })
    },
    config: {
        name: "restart", aliases: [], category: "dev", handler: { deleteInvoke: false, staff: false, dev: true, inPogress: false }, help: { desc: "Permet de redémarrer Lana", use: "nop :D" }, modules: []
    }
}