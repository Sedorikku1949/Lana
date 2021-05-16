const { client } = require("../../managers/eventsManagers")

module.exports = (message) => {
    if (!message.content || message.author.bot) return

    client.channels.cache.get('796376603466661918').send({
        embed: {
          author: { name: `[ MESSAGE ]`, icon_url: message.author.displayAvatarURL({ format: 'png', dynamic: true }) },
          title: `Suppression de message par ${message.author.tag}`,
          description: `dans : <#${message.channel.id}>`,
          fields: [
            { name: 'Le message était :', value: `${message.content.slice(0, 1020)} ${message.content.length > 1024 ? '...' : '\u200b'}` , inline: false},
          ],
          color: '#FA8C81',
          timestamp: Date.now(),
          footer: {text: message.author.id}
        },
      })
}