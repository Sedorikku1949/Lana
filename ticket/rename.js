module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      let [x, msg] = [0, await message.channel.send({ embed: { color: '#2c2f33', title: 'Veux tu renommé ce ticket ?' } })]
      ;(await msg.react('✅')) && (await msg.react('❌'))
    
      const collector = msg.createReactionCollector((react, user) => ['✅', '❌'].includes(react.emoji.name) && user.id == message.author.id, { time: 2 * 60 * 1000 })
      collector.on('collect', async (react) => {
        if (react.emoji.name == '✅') {
          await message.channel.setName(`c${Date.now()}`)
          await msg.edit({
            embed: {
              description: `> **Le ticket a été renommé avec succès**`,
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
        name: "rename", aliases: [], category: "ticket", handler: { deleteInvoke: true, staff: true, dev: false, inPogress: false }, help: { desc: "Renomme le ticket pour une utilisation ultérieur", use: "Aucun argument requis" }, modules: []
    }
  };