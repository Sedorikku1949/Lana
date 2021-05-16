const { client } = require("../../managers/eventsManagers")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!message.member.voice.channel) return message.channel.send({ embed: { description: "> **Tu dois être en vocal pour pouvoir utiliser cette commande**", color: "#2C2F33" }})
        if (!message.guild.members.cache.get(client.user.id).voice.channel) return message.channel.send({ embed: { description: "> **Je ne suis pas en vocal actuellement**", color: "#2C2F33" }})
        client.music.dispatcher.end()
        message.channel.send({ embed: { description: "> **J'ai passé cette musique**", color: "#2C2F33" }})
    },
    config: {
        name: "skip", aliases: ["s"], category: "musique", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "...", use: "..." }, modules: []
    }
}