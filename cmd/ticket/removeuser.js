module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!args[0]) return message.channel.send("```argument requis```")
        const getUser = await message.guild.members.cache.select(args[0], message, true, false)
        if (!getUser) return message.channel.send('user not found')
        await message.channel.updateOverwrite(getUser.user.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false })
        message.channel.send({
          embed: {
            description: `> **L'utilisateur ${getUser.user.tag} a été retiré avec succès au ticket**`,
            timestamp: new Date(),
            color: '#2c2f33',
          },
        })
      },
    config: {
        name: "removeuser", aliases: ["ru"], category: "ticket", handler: { deleteInvoke: true, staff: true, dev: false, inPogress: false }, help: { desc: "Retire un utilisateur du ticket", use: "=ru <user>" }, modules: []
    }
  };