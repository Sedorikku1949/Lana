const fs = require("fs")

function getChannel(args) { return args.replace(/\D/g, '') }

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!args[3]) return message.channel.send({ embed: { color: "#2C2F33", description: "> **Des arguments sont requis pour que je lance un event**"}})
        const channel = message.guild.channels.cache.find(e => e.id == getChannel(args[0]))
        if (!channel) return message.channel.send({ embed: { color: "#2C2F33", description: "> **Je n'ai pas trouver le salon**" }})
        const nb = args[1]
        if (isNaN(nb) || nb < 1) return message.channel.send({ embed: { color: "#2C2F33", description: "> **Le nombre de vainqueur doit être un nombre supérieur ou égale à 1**" }})
        const time = getMs(args[2])
        if (!time || isNaN(time)) return message.channel.send({ embed: { color: "#2C2F33", description: "> **Tu dois donner un temps valide**" }})
        const name = message.content.slice(prefix.length + command.length + args[0].length + args[1].length + args[2].length + 4)
        if (!name || name.length < 1) return message.channel.send({ embed: { color: "#2C2F33", description: "> **Le nom de ce giveaway doit être supérieur à 1 caractère**" }})

        const msg = await channel.send({ embed: {
            color: "#8B8BF7",
            author: { name: "Nouveau giveaway !"},
            title: name,
            fields: [
                {name: "**Nombre de gagnants :**", value: nb, inline: true }, 
                {name: "**Temps :**", value: getDuration(Date.now(), Date.now() + time, "[DD] jours, [hh]h et [mm]m"), inline: true},
                {name: "**Lancer par :**", value: "<@" + message.author.id + ">", inline: true},
                {name: "**Termine le :**", value: getDate(Math.floor(Date.now() + time), `[DD]/[MM]/[YYYY] à [hh]:[mm]`)}
            ],
            footer: { text: "Réagissez à 🎉 pour participer !" }
        }})
        await msg.react("🎉")
        const event = ({ name: name, date: Date.now(), nb: nb,  time: time, author: message.author.id, channel: channel.id, msg: msg.id, finish: false })
        const data = require("../../events.json")
        data.push(event)
        fs.writeFileSync("events.json", JSON.stringify(data, null, 1))
        await deleteCache([`../../events.json`])

        message.channel.send({ embed: { color: "#8B8BF7", description: `> **J'ai lancé un event dans <#${channel.id}>**`}})
    },
    config: {
        name: "create", aliases: [], category: "event", handler: { deleteInvoke: false, staff: true, dev: false, inPogress: false }, help: { desc: "Permet de créer un giveaway au plus grand bonheur des membres", use: "=create <channel> <nb de gagnants> <temp> <nom de l'event>" }, modules: []
    }
}