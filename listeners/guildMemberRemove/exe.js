const { client } = require("../../managers/eventsManagers")
const fs = require("fs")

module.exports = (member) => {

    // stats
    const date = getDate(Date.now(), `[DD][MM][YYYY]`)
    if (!client.stats.leave[date]) client.stats.leave[date] = 0
    client.stats.leave[date] = client.stats.leave[date] + 1

    client.channels.cache.get('796378974179426325').send({
        embed: {
          timestamp: Date.now(),
          color: "#FF9898",
          thumbnail: {url: member.user.displayAvatarURL({dynamic: true, size: 2048, format: 'png'})},
          title: '[ LEAVE ]',
          description: `\`${member.user.tag}\` **a quitté le serveur**`,
          footer: {text: member.id},
          fields: [
            { name: 'Date de création du compte :', value: getDate(member.user.createdTimestamp, `[DD]/[MM]/[YYYY] à [hh]h et [mm]m`) + ` ( ${getDuration(member.user.createdTimestamp, Date.now(), "[DD] jours et [hh]h")} ) ` },
            { name: 'Avait rejoint le :', value: member.joinedTimestamp && member.joinedTimestamp > 0 ? getDate(member.joinedTimestamp, `[DD]/[MM]/[YYYY] à [hh]h et [mm]m`) + ` ( ${getDuration(member.joinedTimestamp, Date.now(), "[DD] jours et [hh]h")} ) ` : "erreur" },
          ],
        },
      })
    client.channels.cache.get("782235571094945792").send(`**\`${member.user.tag}\` nous as quittés...**`)
    client.channels.cache.get("782235568024191003").send(`**Il semblerait que \`${member.user.username}\` soit parti...**`)

    // invitations
    member.guild.fetchInvites().then(async(guildInvites) => {
      const join = require("../../join.json")
      if (!client.invites) throw new Error('client.invites IS NOT DEFINED')
      const ei = client.invites
      client.invites = guildInvites
      if (!join[member.id]) return member.guild.channels.cache.get('790221586359123968').send({ embed: { color: '#A498FF', description: `\`🍁\` **\`${member.user.username}\` est parti(e) du serveur, mais je ne sais pas qui l'a invité**` } })
      const invite = guildInvites.find(e => e.code == join[member.id])
      if (!invite) return member.guild.channels.cache.get('790221586359123968').send({ embed: { color: '#A498FF', description: `\`🍁\` **\`${member.user.username}\` est parti(e) du serveur, mais je ne sais pas qui l'a invité**` } })
      // j'ai mon invitation cible
      await ensure(invite.inviter)
      const data = require(`../../data/${invite.inviter.id}.json`)
      if (!data) return
      data.invite.leave = data.invite.leave + 1
      member.guild.channels.cache.get('790221586359123968').send({
        embed: {
          color: '#A498FF',
          description: `\`🍁\` **\`${member.user.username}\` est parti(e) du serveur , il/elle a été invité(e) par ${invite.inviter.tag} qui possède désormais ${data.invite.join - data.invite.leave} invitations.**`,
        },
      })
      fs.writeFileSync(`data/${data.id}.json`, JSON.stringify(data, null, 1))
      await deleteCache([`../../data/${invite.inviter.id}.json`])
    })
}