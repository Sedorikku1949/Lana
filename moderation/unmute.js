const fs = require("fs")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!args[0] || !args[1]) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je ne sais pas qui demute ou quel mute doit être annulé, voir les deux enfaite**" } })
        const user = await message.guild.members.cache.select(args[0], true, false, false)
        if (!user) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je n'ai pas trouver cette personne**" } })
        const data = require(`../../data/${user.id}.json`)
        if (!data ) return message.channel.send({ embed: { color: '#ED4245', description: `> **Je n'ai pas trouver \`${user.user.tag}\` dans la base de donnée**` } })
        if (data.sanctions.mute.length <= 0 || data.sanctions.mute.filter(e => !e.unmute).length <= 0 ) return message.channel.send({ embed: { color: '#FF6565', description: `> **\`${user.user.tag}\` ne possède aucun mute qui peut être démute**` } })
        if (isNaN(args[1])) return message.channel.send({ embed: { color: "#ED4245", description: "> **Tu dois me donner une id de sanction pour que je reconnaisse le mute**" } })
        let mute = data.sanctions.mute.filter(e => !e.unmute).find(e => e.id == args[1])
        if (!mute) return message.channel.send({ embed: { color: '#FF6565', description: "> **Je n'ai pas trouver le mute voulu**" } })
        const index = data.sanctions.mute.findIndex(e => e.id == args[1])
        data.sanctions.mute[index].unmute = true
        fs.writeFileSync(`data/${data.id}.json`, JSON.stringify(data, null, 1))
        await deleteCache([`../../data/${user.id}.json`])
        const member = client.guilds.cache.get("782235567970713620").members.cache.get(data.id)
        if (!member || !member.roles.cache.has("782614716811706369")) return
        member.roles.remove("782614716811706369").catch(() => 0)
        member.send({ embed: { color: '#FF6565', title: "Tu a été démute par un modérateur !" } }).catch(() => 0)
    },
    config: {
        name: "unmute", aliases: ["um"], category: "moderation", handler: { deleteInvoke: false, staff: true, dev: false, inPogress: false }, help: { desc: "Demute quelqu'un, simplement", use: "=unmute <user> <id de sanction>" }, modules: []
    }
};