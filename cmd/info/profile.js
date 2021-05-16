const { client } = require("../../managers/eventsManagers")
const getBadges = require("../../functions/guilds/badges")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        const user = args[0] ? message.guild.members.cache.select(args[0], false, false, true) : message.member
        if (!user) return message.channel.send("🔎 **Je n'ai pas trouvé cette personne**")
        await ensure(user)
        const data = require(`../../data/${user.id}.json`)
        const guild = require("../../guild.json")
        message.channel.send({ embed : {
            title: `Profile de ${user.user.tag} :`,
            color: "#2C2F33",
            fields: [
                { name: "**Marrié avec :**", value: data.bio.marryID ? `<@${data.bio.marryID}>` : "personne", inline: true },
                { name: `**${args[0] ? "Sa" : "Ta"} guild :**`, value: "```" + (data.guild.id && guild.find(e => e.id == data.guild.id) ? guild.find(e => e.id == data.guild.id).name : "Aucune guild") + "```" , inline: true },
                { name: "**Biographie :**", value: "```"+(data.bio.desc ? data.bio.desc : "aucune")+"```", inline: false },
                { name: "**Badges :**", value: data.bio.badges.length > 0 ? "```\n"+getBadges(data.bio.badges).join("\n")+"```" : "```\nAucun badge```", inline: false},
                { name: "**xp :**", value: "```\n"+`lvl ${data.xp.lvl} / ${data.xp.xp.shortNumber()} pts`+"```", inline: true},
                { name: "**Argent :**", value: "```\n"+`${data.money.cash.shortNumber()}§`+"```", inline: true}
            ],
            thumbnail: { url: user.user.displayAvatarURL({ size: 2048, format: "png", dynamic: true }) }
        }})
    },
    config: {
        name: "profile", aliases: ["p"], category: "info", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Tu peux avoir ton profile ou celui de quelqu'un d'autre grâce à cette commande :D", use: "=profile\n=profile <user>" }, modules: []
    }
};