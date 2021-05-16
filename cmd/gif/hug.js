const { hug } = require("./gifData.json")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
  const gif = hug.gifs[Math.floor(Math.random() * hug.gifs.length)]
  if (!args[0]) return message.channel.send("Je ne sais pas à qui tu veux faire un calin")
  const user = message.guild.members.cache.select(message.content.slice(prefix.length + command.length + 1).trim(), false, false, false)
  if (!user) return message.channel.send("Je n'ai pas trouver à qui tu veux faire un calin")
  message.channel.send({embed: {color: hug.color, description: hug.text.replace("{user}", message.author).replace("{second}", user.user), image: {url: gif} }})
  },
    config: {
        name: "hug", aliases: [], category: "gif", handler: { deleteInvoke: true, staff: false, dev: false, inPogress: false }, help: { desc: "Un calin !!!", use: "=hug <user>" }, modules: []
    },
};
