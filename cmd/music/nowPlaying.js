const { client } = require("../../managers/eventsManagers")

const getBar = async(value, maxValue, size) => {
    const percentage = value / maxValue;
    const progress = Math.round((size * percentage));
    const emptyProgress = size - progress;
  
    const progressText = '▒'.repeat(Math.floor(progress));
    const emptyProgressText = '░'.repeat(Math.floor(emptyProgress));
    const percentageText = Math.round(Math.floor(percentage * 100)) + '%'; 
  
    const bar = '```[' + progressText + emptyProgressText + ']' + percentageText + '```';
    return bar;
};

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!client.music.dispatcher) return message.channel.send({ embed: { color: "#2C2F33", description: "> **Je ne joue aucune musique actuellement**" } })
        message.channel.send({ embed: {
            color: "#2C2F33",
            title: client.music.info.title.slice(0, 253),
            thumbnail: { url: client.music.info.thumbnails.sort((a, b) => b.width - a.width)[0].url },
            fields: [
                { name: "Piste de lecture :", value: await getBar(Date.now() - client.music.startPlaying, client.music.info.lengthSeconds * 1000, 25)},
                { name: 'Temps :', value: getDuration(Date.now(), Date.now() + (Number(client.music.info.lengthSeconds) * 1000), `[mm]:[ss]s`), inline: true },
                { name: 'Catégory :', value: client.music.info.category, inline: true },
                { name: 'Auteur :', value: `[${client.music.info.author.name}](${client.music.info.author.channel_url}) **[ ${client.music.info.author.subscriber_count} abos ]**` },
            ],
            }
        })
    },
    config: {
        name: "nowplaying", aliases: ["np"], category: "musique", handler: { deleteInvoke: false, staff: false, dev: true, inPogress: false }, help: { desc: "...", use: "..." }, modules: []
    }
}