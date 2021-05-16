const { client } = require("../../managers/eventsManagers")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!message.member.voice.channel) return message.channel.send({ embed: { description: "> **Tu dois être en vocal pour pouvoir utiliser cette commande**", color: "#2C2F33" }})
        if (!message.guild.members.cache.get(client.user.id).voice.channel) return message.channel.send({ embed: { description: "> **Je ne suis pas en vocal actuellement**", color: "#2C2F33" }})
        message.member.voice.channel.leave()
        if (client.music.url) client.music.dispatcher.destroy()
        client.music = {}
        client.queue = []
        message.channel.send({ embed: { description: "> **J'ai quitter le vocal avec succès**", color: "#2C2F33" }})
    },
    config: {
        name: "leave", aliases: ["left"], category: "musique", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "...", use: "..." }, modules: []
    }
}