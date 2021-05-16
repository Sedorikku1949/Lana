const s = ["warn", "ban", "mute", "notes", "kick", "badword", "invite", "spam"]
const fs = require("fs")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!args[0] || !args[1] || !args[2]) return message.channel.send("```\Des argument sont requis => =ds user <type de sanctions> <id / nombre d'avertissements auto à retiré (uniquement pour les warns de l'auot mod)>```")
        const user = await message.guild.members.cache.select(args[0], false, false, true)
        if (!user) return message.channel.send("🔎 **Je n'ai pas trouvé cette personne**")
        data = require(`../../../../../data/${user.id}.json`)
        if (!data) return message.channel.send("**Cette personne n'est pas dans la base de donnée**")
        if (!s.includes(args[1])) return message.channel.send(`> **Je n'ai pas compris quel sanctions retiré avec l'argument \`${args[1]}\`**`)
        const sanctionsList = data.sanctions[args[1]]
        if (!sanctionsList) return message.channel.send({ embed: { description: "An error as occured", color: '#FF6565', footer: { text: "[ DEV ] exit code > 1:14" } } })
        const sanctions = sanctionsList.findIndex(e => e.id == args[2])
        if (sanctions < 0) return message.channel.send({ embed: { description: "Je n'ai pas trouvé cette sanctions, il semblerait que elle n'existe pas", color: '#FF6565' } })

        client.channels.cache.get("782235572273938459").send({
            embed: {
                color: '#FF6565', 
                title: `[ SANCTIONS DELETE ]`,
                description: `Une sanction de <@${data.id}> a été supprimée par <@${message.member.id}>`,
                fields: [
                    { name: "**Auteur :**", value: message.author.username + " " + message.author.id, inline: true },
                    { name: "**Raison de l'ancienne sanction :**", value: sanctionsList[sanctions].reason, inline: true },
                    { name: "**L'ancienne sanctions provient de :**", value: `<@${sanctionsList[sanctions].mod}> [ ${sanctionsList[sanctions].mod} ]` },
                    { name: "**L'ancienne sanctions date de :**", value: String(sanctionsList[sanctions].date).getDate(`[DD]/[MM]/[YYYY] à [hh]:[mm] et [ss]`) },
                ],
                footer: { text: sanctionsList[sanctions].id }
            }
        })

        // delete
        if (sanctionsList.length > 1) data.sanctions[args[1]] = data.sanctions[args[1]].splice(sanctions, 1)
        else data.sanctions[args[1]] = []
        message.channel.send({ embed: { title: `La sanction n°${sanctions + 1} a bien été supprimée`, color: '#FF6565' } })
        fs.writeFileSync(`data/${data.id}.json`, JSON.stringify(data, null, 1))
        await deleteCache([`../../data/${data.id}.json`])
    },

    // =ds id warn feuhfufvkuzfqa
    config: {
        name: "deletesanction", aliases: ["ds"], category: "moderation", handler: { deleteInvoke: true, staff: true, dev: false, inPogress: true }, help: { desc: "...", use: "..." }, modules: ["fs"]
    }
};