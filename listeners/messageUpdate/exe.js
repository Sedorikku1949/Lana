const { client } = require("../../managers/eventsManagers")

module.exports = (oldMessage, newMessage) => {
    if (!oldMessage.content || !newMessage.content || oldMessage.author.bot || oldMessage.content == newMessage.content) return
    client.channels.cache.get("796376603466661918").send({
        embed: {
          author: { name: '[ MESSAGE ]', icon_url: newMessage.author.displayAvatarURL({ format: 'png', dynamic: true }) },
          title: `Modification de message par ${newMessage.author.tag}`,
          description: `dans : <#${newMessage.channel.id}>`,
          fields: [
            { name: 'Le message était :', value: `${oldMessage.content.slice(0, 1020)} ${oldMessage.content.length > 1024 ? '...' : '\u200b'}` },
            { name: 'Le message est désormais :', value: `${newMessage.content.slice(0, 1020)} ${newMessage.content.length > 1024 ? '...' : '\u200b'}` },
          ],
          color: '#818CFA',
          timestamp: Date.now(),
          footer: {text: newMessage.author.id}
        },
      })
}