const ticket = require("../../functions/app/ticket")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      if (!args[0] || !args[1]) return message.channel.send("```Un argument supplémentaire est requis | =report <user> <raison>```")
      const user = await message.guild.members.cache.select(args[0], message, true, false)
      if (!user || user.id == message.author.id) return message.channel.send("🔎 **Je n'ai pas trouver cette personne**")
      await ticket(message, message.author, false)
      const chl = message.guild.channels.cache.find(e => e.name == message.author.id)
      if (!chl) return message.channel.send("```Une erreur est survenue...```")
      await chl.send({ embed: {
          color: "#9E79FF",
          title: ` [ REPORT ]`,
          fields: [
              {name: "**Report :**", value: `<@${user.id}> [ ${user.id} ]`, inline: true},
              {name: "**Raison :**", value: message.content.slice(prefix.length + command.length + args[0].length + 2), inline: true},
          ],
          timestamp: Date.now(),
      }})
      chl.send("** **\n**Si tu a des screens à donner, merci de les donner à l'équipe de modération**")
      message.channel.send("📃 **Un ticket a été créer pour ton report ou tu a été mentionné dedans**").then((msg) => { message.delete({timeout: 10000}) ; msg.delete({timeout: 10000})})
  },
    config: {
        name: "report", aliases: [], category: "info", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Un report à faire est toujours mieux avec cette commande", use: "=report <user> <reason>" }, modules: []
    }
};