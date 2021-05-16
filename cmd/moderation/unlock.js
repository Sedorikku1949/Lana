module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      await message.channel.updateOverwrite(message.guild.roles.cache.get('782235568003874817'), { SEND_MESSAGES: null }) // membre
      await message.channel.updateOverwrite(message.guild.roles.cache.get('782235568012001285'), { SEND_MESSAGES: true }) // staff
      await message.channel.updateOverwrite(message.guild.roles.cache.get('782235567970713620'), { SEND_MESSAGES: null }) // @everyone
      message.channel.send({ embed: { color: '#FF6565', description: '**Le salon est désormais unlocked**' } })
    },
    config: {
        name: "unlock", aliases: [], category: "moderation", handler: { deleteInvoke: true, staff: true, dev: false, inPogress: false }, help: { desc: "Permet aux membres de reparler dans le salon", use: "Aucun argument requis" }, modules: []
    }
  };