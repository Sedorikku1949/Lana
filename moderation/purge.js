const { client } = require("../../managers/eventsManagers")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      if (!args[0] || isNaN(args[0])) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je n'ai pas compris combien de messages supprimés ou le format utilisé n'est pas valide**" } })
      const pArg = args[0]
      var arg = pArg
      const maxBulk = 100
      await message.delete().catch(() => {})
      do {
        if (arg > maxBulk) {
          var arg = arg - maxBulk
          await message.channel.bulkDelete(maxBulk).catch(() => {})
        } else {
          await message.channel.bulkDelete(arg).catch(() => {})
          var arg = arg - arg
        }
      } while (arg > 0)
    
      const channel = client.channels.cache.get('782235572273938459')
      channel.send({embed: {
        color: "#FF9898",
        title: "[ PURGE ]",
        fields: [
          {name: 'Nombre de messages supprimés :', value: args[0], inline: true}, 
          {name: "Modérateur:", value: message.author.toString(), inline: true},
          {name: "Date:", value: getDate(Date.now(), `[DD]/[MM]/[YYYY] à [hh]:[mm] et [ss]s`), inline: true},
          {name: "Salon :", value: `<#${message.channel.id}>`, inline: true}
        ],
        color: '#FF6565',
      }})
    },
    config: {
        name: "purge", aliases: ["clear", "nettoyage"], category: "moderation", handler: { deleteInvoke: true, staff: true, dev: false, inPogress: false }, help: { desc: "Nettoie un certains nombres de messages dans le salon", use: "=purge <nb>" }, modules: []
    }
};