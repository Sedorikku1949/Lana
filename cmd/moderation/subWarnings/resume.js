module.exports = async(message, data) => {
    let user = await message.guild.members.cache.select(data.id, false, false, true)
    if (user.user) user = user.user
    message.channel.send({
        embed: {
          title: `Résumé des sanctions de ${user.tag}`,
          description: ` **\`- bans :\`** ${data.sanctions.ban.length} \n **\`- Kicks :\`** ${data.sanctions.kick.length} \n **\`- Mute :\`** ${data.sanctions.mute.length} \n **\`- Warn :\`** ${data.sanctions.warn.length} \n **\`- Notes :\`** ${data.sanctions.notes.length} \n **\`- Badwords :\`** ${data.sanctions.avertissements.badword} \n **\`- Invitations :\`** ${data.sanctions.avertissements.invites} \n **\`- Spam :\`** ${data.sanctions.avertissements.spam}`,
          color: '#6595C1',
          timestamp: Date.now(),
          footer: { text: data.id }
        },
      })
}