const { client } = require("../../managers/eventsManagers")

module.exports = async(link, message, info) => {
    if (client.queue.includes(link)) return
    client.queue.push(link)
    message.channel.send({ embed: {
        color: "#2C2F33",
        author: {name: `Ajouté à la queue avec succès en position ${client.queue.length}`},
        title: info.title.slice(0, 253),
        thumbnail: { url: info.thumbnails.sort((a, b) => b.width - a.width)[0].url },
        fields: [
            { name: 'Temps :', value: getDuration(Date.now(), Date.now() + (Number(info.lengthSeconds) * 1000), `[mm]:[ss]s`), inline: true },
            { name: 'Catégory :', value: info.category, inline: true },
            { name: 'Auteur :', value: `[${info.author.name}](${info.author.channel_url}) **[ ${info.author.subscriber_count} abos ]**` },
        ],
        }
    })
}