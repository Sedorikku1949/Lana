module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      let [x, msg] = [0, await message.channel.send({ embed: { color: '#2c2f33', title: 'Veux tu fermer ce ticket ?' } })]
      ;(await msg.react('✅')) && (await msg.react('❌'))
    
      const collector = msg.createReactionCollector((react, user) => ['✅', '❌'].includes(react.emoji.name) && user.id == message.author.id, { time: 2 * 60 * 1000 })
      collector.on('collect', async (react) => {
        if (react.emoji.name == '✅') {
          const id = message.channel.name
          await message.channel.updateOverwrite(id, { VIEW_CHANNEL: false, SEND_MESSAGES: false })
          await message.channel.setName(`c${Date.now()}`)
          await msg.edit({
            embed: {
              description: `> **Le ticket a été fermer avec succès**`,
              timestamp: new Date(),
              color: '#2c2f33',
            },
          })
          collector.stop()
        }
        if (react.emoji.name == '❌')
          return ( msg.delete().catch(() => {}) && message.channel.send("**Annulation de l'action**").then((mes) => mes.delete({ timeout: 5000 }).catch(() => {})).catch(() => {}) && collector.stop())
      })
    
      collector.on('end', () => msg.reactions.removeAll().catch(() => {}))
    },
    config: {
        name: "close", aliases: [], category: "ticket", handler: { deleteInvoke: true, staff: true, dev: false, inPogress: false }, help: { desc: "Ferme le ticket", use: "Aucun argument requis" }, modules: []
    }
  };