const getDuration = require("../../functions/utils/getDuration");

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
    const user = args[0] ? await message.guild.members.cache.select(args[0], true, false, true) : message.member
    if(args[0] && !user) return message.channel.send("🔎 **Je n'ai pas trouvé cette personne**")
    const create = (user.user ? user.user.createdTimestamp : user.createdTimestamp)
    let field = [ { name: "**Création du compte :**", value: `${getDate(create, `Le [DD]/[MM]/[YYYY] à [hh]:[mm] et [ss]s`)} ( ${getDuration(create, Date.now(), `[DD]d et [hh]h`)} )`, inline: false}, ]
    if (message.guild.members.cache.get(user.id)) {
      field.push({ name: "**A rejoint le :**", value: `${getDate( user.joinedTimestamp, `Le [DD]/[MM]/[YYYY] à [hh]:[mm] et [ss]s`)} ( ${getDuration(user.joinedTimestamp, Date.now(), `[DD]d et [hh]h`)} )`, inline: false},)
    }
    message.channel.send({embed: {
      title: `Information sur ${user.user ? user.user.tag : user.tag}`,
      fields: field,
      color: "#2C2F33",
      thumbnail: {url: user.user ? user.user.displayAvatarURL({size: 2048, format: 'png', dynamic: true}) : user.displayAvatarURL({size: 2048, format: 'png', dynamic: true})},
      footer: {text: user.id}
    }})
  },
    config: {
        name: "ui", aliases: ["userinfo", "user", "u"], category: "moderation", handler: { deleteInvoke: true, staff: true, dev: false, inPogress: false }, help: { desc: "Affiche les informations essentielles sur ton compte ou celui de quelqu'un d'autre", use: "=ui\n=ui <user>" }, modules: []
    }
};