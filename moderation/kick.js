const { client } = require("../../managers/eventsManagers")
const fs = require("fs")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      if (!args[0]) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je ne sais pas qui va se prendre le kick hammer**" } })
    const user = await message.guild.members.cache.select(args[0], true, false, false)
    const reason = message.content.slice(prefix.length + command.length + args[0].length + 2) ? message.content.slice(prefix.length + command.length + args[0].length + 2) : "Aucune raison fournie"
    if (!user) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je n'ai pas trouver cette personne**" } })
    if (!user.kickable || user.roles.cache.has("782235568012001285")) return message.channel.send({embed: {color: '#FF6565', description: "Je ne peux pas expulser cette personne"}})
    if (reason.length >= 512) return message.channel.send({ embed: { color: "#ED4245", description: "> **Il semblerait que la raison soit trop longue**" } })
    await user.send({embed: {color: '#FF6565', description: "Tu a été expulser de The Last Kingdom Of Eden", fields: [{name: "**Raison: **", value: reason}]}}).catch(() => 0)
    const ban = user.kick({days: 7, reason: reason }).catch(() => false)
    if (!ban) return message.channel.send({embed: {color: '#FF6565', description: "Une erreur est survenue..."}})
    else message.channel.send({embed: {color: '#FF6565', description: `${user.user.tag} a subis le kick hammer`}})

    // logs + data
   const d = { date: Date.now(), reason: reason, mod: message.author.id, id: Date.now() + user.id , delete: false}
    client.channels.cache.get("782235572273938459").send({
       embed: {
             color: '#FF6565',
             title: "[ KICK ]",
             description: `<@${user.id}> a été expulsé par <@${message.author.id}>`,
             fields: [
              { name: "**Raison :**", value: d.reason, inline: true },
              { name: "**ID :**", value: d.id, inline: true }
          ],
          footer: { text: user.id }
        }
    })

    await ensure(user)
    data = require(`../../data/${user.id}.json`)
    data.sanctions.kick.push(d)
    fs.writeFileSync(`data/${user.id}.json`, JSON.stringify(data, null, 1))
    await deleteCache([`../../data/${user.id}.json`])
},
    config: {
        name: "kick", aliases: ["kickhammer", "getout"], category: "moderation", handler: { deleteInvoke: true, staff: true, dev: false, inPogress: false }, help: { desc: "Expulse simplement quelqu'un", use: "=kick <user> <reason>" }, modules: ["fs"]
    }
};