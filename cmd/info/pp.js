const { client } = require("../../managers/eventsManagers")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        const user = args[0] ? message.guild.members.cache.select(message.content.slice(prefix.length  + command.length + 1), true, false, true) : message.member
        if (!user) return message.channel.send("🔎 **Je n'ai pas trouver cette personne**")
        message.channel.send({ embed: {
            color: "#2C2F33",
            description: `**<@${user.id}> / ${user.user.tag}\n\n[ \[ Lien de l'avatar \] ](${user.user.displayAvatarURL({ size: 2048, dynamic: true, format: "png" })})**`,
            image: { url: user.user.displayAvatarURL({ size: 2048, dynamic: true, format: "png" })}
        }})
    },
    config: {
        name: "pp", aliases: [], category: "info", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Tu peux avoir ta pp ou celle de quelqu'un d'autre grâce à cette commande !", use: "=pp\n=pp <user>" }, modules: []
    }
};