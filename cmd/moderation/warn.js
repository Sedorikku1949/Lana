const { client } = require("../../managers/eventsManagers")
const fs = require("fs");

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
    if (!args[0] || !args[1]) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je ne peux pas avertir quelqu'un car je ne sais pas qui tu veux avertir, ou il me manque la raison, voir les deux**" } })
    const user = await message.guild.members.cache.select(args[0], true, false, false)
    const reason = message.content.slice(prefix.length + command.length + args[0].length + 2)
    if (!user) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je n'ai pas trouver cette personne**" } })
    if (!reason) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je n'ai pas trouvée la raison ou celle ci n'est pas valide**" } })
    await ensure(message.author)
    data = require(`../../data/${user.id}.json`)
    const obj = ({date: Date.now(), mod: message.author.id, reason: reason, id: Date.now() + user.id, delete: false})
    data.sanctions.warn.push(obj)
    await fs.writeFileSync(`data/${user.id}.json`, JSON.stringify(data, null, 1))
    await deleteCache([`../../data/${user.id}.json`])
    user.send({embed: {color: '#FF6565', description: "Tu a été avertie sur The Last Kingdom Of Eden", fields: [{name: "**Raison :**", value: reason}], footer: {text: `Tu possède désormais ${data.sanctions.warn.length} warn(s)`}}}).catch(() => 0)
    message.channel.send({embed: {description: `"${user.user.tag}" a été avertie avec succès !`, color: '#FF6565'}})

    client.channels.cache.get("782235572273938459").send({embed: {
        color: '#FF6565',
        title: "[ WARN ]",
        description: `<@${user.id}> a été avertie par <@${message.author.id}>`,
        fields: [
          { name: "**Raison :**", value: reason, inline: true},
          { name: "**ID :**", value: obj.id, inline: true}
        ],
        footer: { text: user.id }
      }})
},
    config: {
        name: "warn", aliases: ["avertis"], category: "moderation", handler: { deleteInvoke: true, staff: true, dev: false, inPogress: false }, help: { desc: "Avertie quelqu'un", use: "=warn <user> <reason>" }, modules: []
    }
};