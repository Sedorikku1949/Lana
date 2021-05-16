const { client } = require("../../managers/eventsManagers")

module.exports = async(invite) => {
    client.channels.cache.get("782235572273938459").send({ embed: {
        title: `[ INVITE DELETE ]`,
        color: '#FF6565',
        description: `l'invitation \`${invite.code}\` pour le salon <#${invite.channel.id}> a été supprimé par un administrateur`,
        fields: [
            {name: "Auteur de l'invitation :", value: `<@${invite.inviter ? invite.inviter.id : "undefined"}> [ ${invite.inviter ? invite.inviter.id : "undefined"} ]`, inline: true},
            { name: "Lien :", value: `${invite.url}`, inline: true},
            { name: "Utilisations :", value: invite.use ? invite.use : "0", inline: true},
            { name: "Other :", value: `maxAges : ${invite.maxAge ? invite.maxAge : "∞"}\nmaxUses : ${invite.maxUses ? invite.maxUses : "∞"}\nTemporaire: ${invite.temporary}`}
        ],
        footer: { text: "Discord ne m'a peut être pas envoyé les bonnes informations, il y a plus d'informations dans les auditLogs" }
    } })
}