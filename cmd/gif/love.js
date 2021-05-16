const { love } = require("./gifData.json")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
  const gif = love.gifs[Math.floor(Math.random() * love.gifs.length)]
  if (!args[0]) return message.channel.send("Je ne sais pas à qui tu veux faire un calin")
  const user = message.guild.members.cache.select(message.content.slice(prefix.length + command.length + 1).trim(), false, false, false)
  if (!user) return message.channel.send("Je n'ai pas trouver à qui tu veux faire un calin")
  message.channel.send({embed: {color: love.color, description: love.text.replace("{user}", message.author).replace("{second}", user.user), image: {url: gif} }})
  },
    config: {
        name: "love", aliases: [], category: "gif", handler: { deleteInvoke: true, staff: false, dev: false, inPogress: false }, help: { desc: "L'amour c'est beau", use: "=love <user>" }, modules: []
    },
};
