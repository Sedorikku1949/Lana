function getRank(str) {
    return str.replace(/member|officer|responsable/gm, (a,b) => {
        switch(a) {
            case "member": return "👤"
            case "officer": return "👮‍♀️"
            case "responsable": return "👨‍✈️"
        }
    })
}

const getBar = (value, maxValue, size) => {
    const percentage = value / maxValue;
    const progress = Math.round((size * percentage));
    const emptyProgress = size - progress;
  
    const progressText = '▒'.repeat(Math.floor(progress));
    const emptyProgressText = '░'.repeat(Math.floor(emptyProgress));
    const percentageText = Math.round(Math.floor(percentage * 100)) + '%'; 
  
    const bar = '```[' + progressText + emptyProgressText + ']' + percentageText + '```';
    return bar;
}

const getRankLevel = require("../../functions/guilds/getRankLvl")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        const data = require(`../../data/${message.author.id}.json`)
        const guildList = require("../../guild.json")
        const guild = args[0] ? guildList.find(e => e.name.toLowerCase().includes(message.content.slice(prefix.length + command.length + 1).trim().toLowerCase()) || e.id == message.content.slice(prefix.length + command.length + 1).trim().toLowerCase()) : guildList.find(e => e.id == data.guild.id)
        if (!guild) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nJe n'ai pas trouver la guild demandé ou alors tu n'es dans aucune guild```" } })
        
        message.channel.send({ embed: {
            color: "#2C2F33",
            author: { name: `Informations sur ${guild.name}` },
            thumbnail: { url: guild.icon },
            description: "```\n" + guild.description + "```",
            fields: [
                { name: "Responsable :", value: `<@${guild.responsable}>`, inline: true },
                { name: "Pts :", value: `PGG >> \`${guild.pts.pgg}\`\nPGM >> \`${guild.pts.pgm}\``, inline: true },
                { name: "**Jusqu'au prochain niveau :**", value: getBar(guild.lvl > 1 ? guild.pts.pgm - (getRankLevel()[guild.rank][guild.lvl - 1]) : guild.pts.pgm, getRankLevel()[guild.rank][guild.lvl], 20), inline: false },
                { name: "Rank :", value: `rang ${guild.rank} / lvl ${guild.lvl}`, inline: false },
                { name: "Membres :", value: guild.members.filter(e => message.guild.members.cache.select(e.id, false, false, false)).map(e => `\`[ ${getRank(e.rank )} ]\` <@${e.id}>`), inline: true },
                { name: "Créer le :", value: `${getDate(guild.createdTimestamp, `[DD]/[MM]/[YYYY] à [hh]:[mm]`)} ( il y a ${getDuration(guild.createdTimestamp, Date.now(), "[DD] jours")} )`, inline: true }
            ]
        }})
    },
    config: {
        name: "guildinfo", aliases: ["gi"], category: "guild", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: true }, help: { desc: "Permet d'avoir des infos sur sa guild", use: "=gi <guild (facultatif)>" }, modules: []
    }
};