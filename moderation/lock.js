module.exports = {
    exe: async (message, args, modules, prefix, command) => {
    await message.channel.updateOverwrite(message.guild.roles.cache.get('782235568003874817'), { SEND_MESSAGES: false }) // membre
    await message.channel.updateOverwrite(message.guild.roles.cache.get('782235568012001285'), { SEND_MESSAGES: true }) // staff
    await message.channel.updateOverwrite(message.guild.roles.cache.get('782235567970713620'), { SEND_MESSAGES: false }) // @everyone
    message.channel.send({ embed: { color: '#FF6565', description: '**Le salon est désormais locked**' } })
  },
    config: {
        name: "lock", aliases: [], category: "moderation", handler: { deleteInvoke: true, staff: true, dev: false, inPogress: false }, help: { desc: "Bloque le salon", use: "Aucun argument requis" }, modules: []
    }
};