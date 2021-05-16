const { client } = require("../../managers/eventsManagers")
const cb = require("cleverbot-free")
const badword = require("../../badword.json")
let cooldown = false

const chat = {}

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!chat[message.author.id]) chat[message.author.id] = []
        if (!args[0]) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nJe ne sais pas ce que tu veux me dire```" } })
        if (chat[message.author.id].length >= 1000) return chat[message.author.id] = [] && message.channel.send({ embed: { color: "#2C2F33", description: "```\nJ'ai redémarré la discussion à zéro par soucis de performance ( plus de 1000 messages enregistrés )```" } })
        if (cooldown) return message.channel.send({ embed: { color: "#2C2F33", description: `\`\`\`\nTu dois attendre que personne n'utilise la commande en même temps\`\`\`` } })
        cooldown = true
        message.channel.startTyping()
        let resp = false
        try { resp = await cb(message.content.slice(prefix.length + command.length + 1), chat[message.author.id]) }
            catch(err) {}

        if (!resp) return message.channel.send("```\nAn error as occured, please retry```")
        chat[message.author.id].push(message.content.slice(prefix.length + command.length + 1))
        chat[message.author.id].push(resp)
        message.channel.stopTyping()
        const msg = await message.channel.send({ embed: { description: `${resp}`, color: "#2C2F33", author: { name: message.author.tag }, footer: { text: "Pour redémarrer la discussion à zéro, réagis à 📭" } } })
        cooldown = false
        await msg.react("📭")
        const collector = msg.createReactionCollector((react) => react.emoji.name == "📭" && react.users.cache.find(e => e.id == message.author.id), { time: 30000 })
        collector.on("collect", async(react) => {
            chat[message.author.id] = []
            await msg.channel.send({ embed: { color: "#2C2F33", description: "```\nLa discussion a été remise à zéro```" } }).catch(() => false)
            collector.stop()
        })
        collector.on("end", () => msg.reactions.removeAll())
    },
    config: {
        name: "chatbot", aliases: ["chat"], category: "game", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Une ia :D", use: "=chat <text>" }, modules: []
    }
  };
  