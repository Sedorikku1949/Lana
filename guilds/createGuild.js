const fs = require("fs");

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!args[0] || !args[1]) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nTu as mal écrit la commande, c'est =cg author name```" } })
        const user = message.guild.members.cache.select(args[0], false, false, false)
        if (!user) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nJe n'ai pas trouvé la personne qui souhaite créer la guilde```" } })
        if (require(`../../data/${user.id}.json`).guild.id) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nLe futur responsable de cette guild est déjà dans une guild```" } })
        let name = message.content.slice(prefix.length + command.length + 1 + args[0].length + 1).trim().replace(/[^\w ]/g, "")
        let guildList = require("../../guild.json")
        if (name.length < 1) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nLe nom de la guild doit être supérieur à un caractère" } })
        if (name > 20) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nLe nom de la guild doit être inférieur à 20 caractères" } })
        const obj = {
            name: name,
            members: [ { rank: "responsable", id: user.id } ],
            // types de ranks : "member", "officer", "responsable"
            banner: null,
            description: `Une guilde créé par ${user.user.tag}`,
            icon: null,
            id: Date.now(),
            pts: {
                pgg: 0,
                pgm: 0,
            },
            rank: 1,
            rankRappel: false,
            lvl: 1,
            bonus: {
                xp: 1,
                money: 1,
                pgm: 1
            },
            createdTimestamp: Date.now(),
            server: null,
            author: user.id,
            responsable: user.id,
        };
        guildList.push(obj)
        fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))

        const data = require(`../../data/${user.id}.json`)
        data.guild.id = obj.id
        fs.writeFileSync(`data/${user.id}.json`, JSON.stringify(data, null, 1))
        await deleteCache([`../../data/${user.id}.json`, "../../guild.json"])

        await message.channel.send({ embed: { color: "#2C2F33", description: `**J'ai créer avec succès la guild "${name}"**` } })
        await user.send({ embed: {
            color: "#2C2F33",
            description: `**Félicitation, tu vient de créer ta propre guild, je vais te donner quelques conseils :**`,
            fields: [
                { name: "Invite des amis", value: "Avoir une guild est bien, mais en avoir une avec des amis est encore mieux, invite tes amis à se joindrent à toi, tu peux aussi inviter des membres.\nIls ont justent à faire la commande =gj <id ou nom de guilde>", inline: false }
            ]
        } })
    },
    config: {
        name: "createguild", aliases: ["cg"], category: "guild", handler: { deleteInvoke: false, staff: true, dev: false, inPogress: true }, help: { desc: "Créer une guild c'est devenu si simple...", use: "=cg <responsable de la guild> <nom de la guild>" }, modules: []
    }
};
