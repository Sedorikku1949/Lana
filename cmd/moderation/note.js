const { client } = require("../../managers/eventsManagers")
const fs = require("fs")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!args[0] || !args[1]) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je ne sais pas qui noter ou pourquoi, voir les deux**" } })
        const user = await message.guild.members.cache.select(args[0], true, false, false)
        const reason = message.content.slice(prefix.length + command.length + args[0].length + 2)
        if (!user) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je n'ai pas trouver cette personne'**" } })
        if (!reason) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je n'ai pas trouvée la raison**" } })
        await ensure(user)
        data = require(`../../data/${user.id}.json`)
        if (!data) {
            await ensure(user)
            data = require(`../../data/${user.id}.json`)
        }
        const obj = ({date: Date.now(), mod: message.author.id, reason: reason, id: Date.now() + user.id, delete: false})
        data.sanctions.notes.push(obj)
        await fs.writeFileSync(`data/${user.id}.json`, JSON.stringify(data, null, 1))
        await deleteCache([`../../data/${user.id}.json`])
        message.channel.send({embed: {description: `"${user.user.tag}" a recu une nouvelle note avec succès !`, color: '#FF6565'}})

        client.channels.cache.get("782235572273938459").send({embed: {
            color: '#FF6565',
            title: "[ NOTE ]",
            description: `<@${user.id}> a recu une nouvelle note par <@${message.author.id}>`,
            fields: [
              { name: "**Note :**", value: reason, inline: true},
              { name: "**ID :**", value: obj.id, inline: true}
         ],
         footer: { text: user.id }
        }})
    },
    config: {
        name: "note", aliases: ["notes"], category: "moderation", handler: { deleteInvoke: true, staff: true, dev: false, inPogress: false }, help: { desc: "Ajoute une note à quelqu'un qui seras consultable par tout les staffs", use: "=note <user> <note>" }, modules: ["fs"]
    }
};