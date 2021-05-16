module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        await message.channel.send({ embed: { color: "#2C2F33", description: "> **Arrêt du programme...**" } })
        process.exit()
    },
    config: {
        name: "exit", aliases: [], category: "dev", handler: { deleteInvoke: false, staff: false, dev: true, inPogress: false }, help: { desc: "Une commande qui coupe Lana  (littéralement)", use: "nop :D" }, modules: []}
}