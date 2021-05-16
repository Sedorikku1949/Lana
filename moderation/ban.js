const { client } = require("../../managers/eventsManagers")
const fs = require("fs")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
    if (!args[0]) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je ne sais pas qui va se prendre le ban hammer**" } })
    const user = await message.guild.members.cache.select(args[0], true, false, true)
    const reason = message.content.slice(prefix.length + command.length + args[0].length + 2) ? message.content.slice(prefix.length + command.length + args[0].length + 2) : "Aucune raison fournie"
    if (!user) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je n'ai pas trouvée cette personne**" } })
    if (message.guild.members.cache.get(user.id) && (!user.bannable || user.roles.cache.has("782235568012001285"))) return message.channel.send({embed: {color: '#FF6565', description: "Je ne peux pas bannir cette personne"}})
    if (reason.length >= 512) return message.channel.send({ embed: { color: "#ED4245", description: "> **Il semblerait que la raison soit trop longue !**" } })
    if (message.guild.members.cache.get(user.id)) await user.send({embed: {color: '#FF6565', description: "Tu a été bannis de The Last Kingdom Of Eden", fields: [{name: "**Raison: **", value: reason}]}}).catch(() => 0)
    const ban = message.guild.members.ban(user.id, {days: 7, reason: reason })
    if (!ban) return message.channel.send({embed: {color: '#FF6565', description: "Une erreur est survenue..."}})
    else message.channel.send({embed: {color: '#FF6565', description: `${user.tag ? user.tag : user.user.tag} a subis le ban hammer`}})

    // logs + data
    const id = Date.now() + user.id
    await ensure(user)
    data = require(`../../data/${user.id}.json`)
    data.sanctions.ban.push({ date: Date.now(), reason: reason, mod: message.author.id, id: id, delete: false})
    fs.writeFileSync(`data/${user.id}.json`, JSON.stringify(data, null, 1))
    await deleteCache([`../../data/${user.id}.json`])

    client.channels.cache.get("782235572273938459").send({embed: {
      color: '#FF6565',
      title: "[ BAN ]",
      description: `<@${user.id}> a été banni par <@${message.author.id}>`,
      fields: [
        { name: "**Raison :**", value: reason, inline: true},
        { name: "**ID :**", value: id, inline: true},
      ],
      footer: { text: user.id }
    }})
},
    config: {
        name: "ban", aliases: ["banhammer"], category: "moderation", handler: { deleteInvoke: false, staff: true, dev: false, inPogress: false }, help: { desc: "Permet de donne un ban en aller simple", use: "=ban <user> <reason>" }, modules: ["fs"]
    }
};