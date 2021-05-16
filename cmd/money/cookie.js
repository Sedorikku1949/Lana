module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!args[0]) return message.channel.send(":cookie: **Je ne sais pas qui va recevoir ce magnifique cookie**")
        const user = message.guild.members.cache.select(message.content.slice(prefix.length + command.length + 1), false, false, false)
        if (!user) return message.channel.send("> **Je n'ai malheureusement pas trouvé cette personne**")
    },
    config: {
        name: "cookie", aliases: ["cookies"], category: "fun", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: true }, help: { desc: "...", use: "..." }, modules: []
    }
}