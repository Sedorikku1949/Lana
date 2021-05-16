module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!args[0]) return message.channel.send("```argument requis```")
        const getUser = await message.guild.members.cache.select(args[0], message, true, false)
        if (!getUser) return message.channel.send('user not found')
        await message.channel.updateOverwrite(getUser.user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: true })
        message.channel.send({
          embed: {
            description: `> **L'utilisateur ${getUser.user.tag} a été ajouté avec succès au ticket**`,
            timestamp: new Date(),
            color: '#2c2f33',
          },
        })
      },
    config: {
        name: "adduser", aliases: ["au"], category: "ticket", handler: { deleteInvoke: true, staff: true, dev: false, inPogress: false }, help: { desc: "Ajoute quelqu'un au ticket", use: "=au <user>" }, modules: []
    }
  };