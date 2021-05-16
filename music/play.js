const ytdl = require("ytdl-core-discord")
const { client } = require("../../managers/eventsManagers")
const play = require("../../functions/music/playMusic")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!args[0]) return message.channel.send({embed: { color: "#2C2F33", description: "> **Un argument est requis.**"} })
        if (!message.member.voice.channel) return message.channel.send({embed: { color: "#2C2F33", description: "> **Tu dois être connecté dans un vocal pour mettre de la musique.**"} })
        const connection = await message.member.voice.channel.join()
        let musique = await ytdl(message.content.slice(prefix.length + command.length + 1)).catch(() => false)
        if (!musique) return message.channel.send({embed: { color: "#2C2F33", description: "> **Je n'ai pas trouvé la musique demandé.**"} })
        let musicINFO = await (await ytdl.getInfo(message.content.slice(prefix.length + command.length + 1))).videoDetails
        play(prefix, command, message, connection, musicINFO, musique, message.content.slice(prefix.length + command.length + 1) )
    },
    config: {
        name: "play", aliases: [], category: "musique", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "...", use: "..." }, modules: []
    }
}