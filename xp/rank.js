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
        const getUser = args[0] ? message.guild.members.cache.select(args[0], false, false, false) : message.member
        if (args[0] && !await message.guild.members.cache.select(args[0], false, false, false)) return message.channel.send("```Je n'ai trouver personne```")
        data = require(`../../data/${getUser.id}.json`)
        if (!data) return message.channel.send("```Cette personne n'est pas dans la base de donnée```")
        data = data.xp
        const xp_level = 5 / 6 * (data.lvl + 1) * (2 * (data.lvl + 1) * (data.lvl + 1) + 27 * (data.lvl + 1) + 91);
        const xp_remove = 5 / 6 * (data.lvl - 1) * (2 * (data.lvl - 1) * (data.lvl - 1) + 27 * (data.lvl - 1) + 91);
        message.channel.send({embed: {
            title: `Informations sur ${getUser.user.tag}`,
            fields: [
                {name: "XP :", value: `\`\`\` ${Math.floor(data.xp)} pts d'xp \n lvl ${Math.floor(data.lvl)} \n ${Math.floor(xp_level - data.xp)} pts jusqu'au prochain niveau\`\`\``, inlinne: false},
                {name: "Pour le prochain niveau :", value: await getBar(data.xp - xp_remove, xp_level - xp_remove, 20)}
            ],
            color: '#7289DA',
        }})
    },
    config: {
        name: "rank", aliases: [], category: "eco", handler: { deleteInvoke: true, staff: false, dev: false, inPogress: false }, help: { desc: "Affiche les infos de l'xp pour toi ou la personne que tu souhaite", use: "=rank\n=rank <user>" }, modules: []
    }
  };