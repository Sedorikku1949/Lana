const ensure = require("../../functions/app/ensure")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        const user = args[0] ? message.guild.members.cache.select(args[0], false, false, false) : message.member
        if (!user) return message.channel.send("**🔎 Je n'ai pas trouvé cette personne**")
        await ensure(user)
        const data = require(`../../data/${user.id}.json`)
        message.channel.send({ embed: {
            title: `Informations sur ${user.user.tag}`,
            fields: [
                {name: "**Argent :**", value: data.money.cash + "§"},
                {name: "**Cooldowns :**", value: `\`Daily\` : ** **${data.money.daily > Date.now() ? "❌" : "✅"} **(${ data.money.daily > Date.now() ? getDuration(Date.now(), data.money.daily, "[hh]h") : "now" })**\n\`Hebdo\` : ** **${data.money.hebdo > Date.now() ? "❌" : "✅"} **(${ data.money.hebdo > Date.now() ? getDuration(Date.now(), data.money.hebdo, "[DD]d et [hh]h") : "now" })**\n\`Hourly\` : ${data.money.hourly > Date.now() ? "❌" : "✅"} **(${ data.money.hourly > Date.now() ? getDuration(Date.now(), data.money.hourly, "[mm]m") : "now" })**\n\`Fish\` : ** ** ${data.money.fish > Date.now() ? "❌" : "✅"} **(${ data.money.fish > Date.now() ? getDuration(Date.now(), data.money.fish, "[hh]h") : "now" })**\n\`Work :\` ** **${data.money.work > Date.now() ? "❌" : "✅"} **(${ data.money.work > Date.now() ? getDuration(Date.now(), data.money.work, "[hh]h") : "now" })**`}
            ],
            color: '#7289DA',
        }})
    },
    config: {
        name: "money", aliases: [], category: "eco", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Tu peux voir ton compte en banque ou celui d'autres personnes grâce à cette commande !", use: "=money\n=money <user>" }, modules: []
    }
}