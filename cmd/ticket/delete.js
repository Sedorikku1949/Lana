module.exports = {
    exe: async (message, args, modules, prefix, command) => {
    let [x, msg] = [0, await message.channel.send({ embed: { color: '#2c2f33', title: 'Veux tu supprimer ce ticket ?' } })]
    ;(await msg.react('✅')) && (await msg.react('❌'))
  
    const collector = msg.createReactionCollector((react, user) => ['✅', '❌'].includes(react.emoji.name) && user.id == message.author.id, { time: 2 * 60 * 1000 })
    collector.on('collect', async (react) => {
      if (react.emoji.name == '✅') {
        await msg.edit({
          embed: {
            description: `> **Suppression du salon dans 10s....**`,
            timestamp: new Date(),
            color: '#2c2f33',
          },
        })
        setTimeout(() => { msg.channel.delete({reason: "Suppression d'un ticket par "+message.author.tag}).catch(() => {}) }, 10000)
        await collector.stop()
      }
      if (react.emoji.name == '❌')
        return ( msg.delete().catch(() => {}) && message.channel.send("**Annulation de l'action**").then((mes) => mes.delete({ timeout: 5000 }).catch(() => {})).catch(() => {}) && collector.stop())
    })
  
    collector.on('end', () => msg.reactions.removeAll().catch(() => {}))
  },
    config: {
        name: "delete", aliases: ["del"], category: "ticket", handler: { deleteInvoke: true, staff: true, dev: false, inPogress: false }, help: { desc: "Supprime le ticket", use: "Aucun argument requis" }, modules: []
    }
};