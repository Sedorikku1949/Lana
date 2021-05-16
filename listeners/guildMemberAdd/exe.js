const { client } = require("../../managers/eventsManagers")
const fs = require('fs')

function giveTheGuide(member) {
  // si ce n'est pas le bot 24h/24 et que le bot 24/24 est co
  if (client.user.id !== "806438484159102996" && client.users.cache.get("806438484159102996").presence.status !== "offline" ) return
  member.send({ embed: {
    color: "#2C2F33", 
    description: "> **Bonjour jeune homme/femme, désolé de te mp mais je souhaite te parler d'un salon :**\n\n<#841648515888709642>\n\n```\nCe salon te propose un petit guide, alors dépeche toi d'accepter la charte du serveur puis de cocher le règlement pour aller le lire :D```",
    footer: { text: "Par ailleurs, bienvenue parmis nous 😉" }
  }}).catch(() => false)
}

module.exports = async(member) => {
      // stats
      const date = getDate(Date.now(), `[DD][MM][YYYY]`)
      if (!client.stats.join[date]) client.stats.join[date] = 0
      client.stats.join[date] = client.stats.join[date] + 1 

      client.channels.cache.get('796378974179426325').send({
          embed: {
            timestamp: Date.now(),
            color: '#98FFA3',
            title: '[ JOIN ]',
            thumbnail: {url: member.user.displayAvatarURL({dynamic: true, size: 2048, format: 'png'})},
            description: `\`${member.user.tag}\` **a rejoins le serveur**`,
            footer: {text: member.id},
            fields: [{ name: 'Date de création du compte :', value: getDate(member.user.createdTimestamp, `[DD]/[MM]/[YYYY] à [hh]h et [mm]m`) + ` ( ${getDuration(member.user.createdTimestamp, Date.now(), "[DD] jours et [hh]h")} ) ` }],
          },
        })
      client.channels.cache.get("782235571094945792").send(`**\`${member.user.tag}\` nous as rejoint !**`)
      client.channels.cache.get("782235568024191003").send({embed: {title: `Bienvenue ${member.user.username} parmis nous !`,image: {url: "https://cdn.discordapp.com/attachments/782235568024190998/815572604873343016/tenor.gif"}, color: "#FFE894"}})
      giveTheGuide(member)

      // invitations
      member.guild.fetchInvites().then(async(guildInvites) => {
        if (!client.invites) throw new Error('client.invites IS NOT DEFINED')
        const ei = client.invites
        client.invites = guildInvites
        if (!ei) return
        const invite = guildInvites.find((i) => ei.get(i.code) && ei.get(i.code).uses < i.uses)
        if (!invite) return member.guild.channels.cache.get('790221586359123968').send({ embed: { color: '#A498FF', description: `\`🍁\` **\`${member.user.username}\` est arrivé(e) sur le serveur, mais je ne sais pas qui l'a invité**` } })
        // j'ai mon invitation cible
        await ensure(invite.inviter)
        const data = require(`../../data/${invite.inviter.id}.json`)
        if (!data) return
        data.invite.join = data.invite.join + 1
        member.guild.channels.cache.get('790221586359123968').send({
          embed: {
            color: '#A498FF',
            description: `\`🍁\` **\`${member.user.username}\` est arrivé(e) sur le serveur grâce à ${invite.inviter.tag} qui possède désormais ${data.invite.join - data.invite.leave} invitations.**`,
          },
        })
        fs.writeFileSync(`data/${data.id}.json`, JSON.stringify(data, null, 1))
        const join = require("../../join.json")
        join[member.id] = invite.code
        fs.writeFileSync("join.json", JSON.stringify(join, null, 1))
        await deleteCache([`../../join.json`, `../../data/${invite.inviter.id}.json`])
      })
    }