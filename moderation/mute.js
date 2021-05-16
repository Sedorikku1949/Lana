const { client } = require("../../managers/eventsManagers")
const fs = require("fs")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      if (!args[0] || !args[1] || !args[2]) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je ne sais pas qui va se prendre le mute hammer ou combien de temps je doit l'empecher de parler, ou la raison, voir les 3 enfaite**" } })
      const user = await message.guild.members.cache.select(args[0], true, false, false)
      if (!user) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je n'ai pas trouver cette personne**" } })
      const reason = message.content.slice(prefix.length + command.length + args[0].length + args[1].length + 3)
      if (!reason || reason.length <= 1) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je n'ai pas trouver la raison ou son format ne convient pas à l'enregistrement de la sanction**" } })
      const time = getMs(args[1])
      if (typeof time !== "number") return message.channel.send({ embed: { color: "#ED4245", description: "> **Le temps de mute n'a pas été préciser ou son format ne convient pas**" } })
      await user.roles.add("782614716811706369").catch(() => 0)
      user.send({embed: {description: "Tu a été mute sur le serveur The Last Kingdom Of Eden", color: '#FF6565', fields: [{name: "**Temps :**", value: getDuration(Date.now() , (Date.now() + time), `[hh]h`), inline: true},{name: "**Raison :**", value: reason, inline: true}]}}).catch(() => 0)
      message.channel.send({embed: {description: `"${user.user.tag}" a été mute avec succès`, color: '#FF6565'}})
      const obj = ({
        id: Date.now() + user.id,
        mod: message.author.id,
        time: time,
        date: Date.now(),
        reason: reason,
        unmute: false,
      })
      client.channels.cache.get("782235572273938459").send({embed: { 
        color: '#FF6565', 
        title: "[ MUTE ]", 
        description: `<@${user.id}> a été mute par <@${message.author.id}>`, 
        fields: [
          { name: "**Raison :**", value: reason, inline: true},
          { name: "**ID :**", value: Date.now() + user.id, inline: true},
          { name: "**Temps :**", value: getMs(time), inline: true}
        ],
        footer: { text: user.id }
      }
      })
      await ensure(user)
      data = require(`../../data/${user.id}.json`)
      data.sanctions.mute.push(obj)
      fs.writeFileSync(`data/${user.id}.json`, JSON.stringify(data, null, 1))
      await deleteCache([`../../data/${user.id}.json`])
    // =mute user time reason
  },
    config: {
        name: "mute", aliases: ["chut"], category: "moderation", handler: { deleteInvoke: true, staff: true, dev: false, inPogress: false }, help: { desc: "Rend muet quelqu'un en vocal et à l'écrit sur le serveur", use: "=mute <user> <time> <reason>" }, modules: ["fs"]
    }
};