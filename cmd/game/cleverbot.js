const { client } = require("../../managers/eventsManagers")
const cb = require("cleverbot-free")
let cooldown = false

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (cooldown) return message.channel.send({ embed: { color: "#2C2F33", description: `\`\`\`\nTu dois attendre que personne n'utilise la commande en même temps\`\`\`` } })
        if (!args[0]) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nJe ne sais pas ce que tu veux me dire```" } })
        cooldown = true
        message.channel.startTyping()
        try { message.channel.send(`**${message.author.tag} >>** ${await cb(message.content.slice(prefix.length + command.length + 1))}`) }
           catch(err) { message.channel.send("```\nAn error as occured, please retry```") }
        message.channel.stopTyping()
        cooldown = false
    },
    config: {
        name: "cleverbot", aliases: ["cb"], category: "game", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Une ia :D", use: "=cb <text>" }, modules: []
    }
  };
  