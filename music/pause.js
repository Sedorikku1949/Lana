const { client } = require("../../managers/eventsManagers")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!message.member.voice.channel) return message.channel.send({ embed: { description: "> **Tu dois être en vocal pour pouvoir utiliser cette commande**", color: "#2C2F33" }})
        if (!message.guild.members.cache.get(client.user.id).voice.channel) return message.channel.send({ embed: { description: "> **Je ne suis pas en vocal actuellement**", color: "#2C2F33" }})
        if (!client.music.dispatcher) return message.channel.send({ embed: { description: "> **Je ne joue aucune musique actuellement**", color: "#2C2F33" }})
        client.music.dispatcher.pause()
        message.channel.send({ embed: { description: "> **J'ai mis la musique en pause avec succès !**", color: "#2C2F33" }})
    },
    config: {
        name: "pause", aliases: [], category: "musique", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "...", use: "..." }, modules: []
    }
}