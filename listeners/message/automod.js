const badword = require("../../badword.json")

const fs = require("fs")
const { client } = require("../../managers/eventsManagers")

function replaceMarkDown(str) { return str.replace(/\`|\*|\.|\~|\,|\>|\_|\\|\/|\?|\!|\-|\'|\"|\&|\#|\:|\;|\§|\@|\²/g, "") }

const spamMessage = {}
const warnMSG = {}
const kickMSG = {}
const whitelistCommand = ["$w"]

const universalWarnings = {}

module.exports = async(message) => {
    if (message.guild.id !== "782235567970713620") return
    if (message.member && message.member.roles.cache.has("782235568012001285")) return
    const args = replaceMarkDown(message.content.toLowerCase()).split(/\s+/g)

    if (!universalWarnings[message.author.id]) universalWarnings[message.author.id] = 0

    const bannedLink = ["https://tornadus.net/orange", "https://thumbs.gfycat.com/SlipperyBelatedKudu-size_restricted.gif"]
    // liens interdits
    if (bannedLink.some(e => message.content.includes(e) )) {
      await message.member.ban({ reason: "[ AUTOMOD ] utilise un lien interdit", days: 7}).catch(() => false)
      message.channel.send({ embed: { color: '#FF6565', description: `> **\`${message.author.username}\` a été banni par sécurité en envoyant un gif qui fait crash discord**` } })
    }


    // anti-spam
    if (spamMessage[message.author.id] >= 9) {
      spamMessage[message.author.id] = 0
      if (!warnMSG[message.author.id]) warnMSG[message.author.id] = 0
      if (warnMSG[message.author.id] >= 1 && !kickMSG[message.author.id]) {
        kickMSG[message.author.id] = true
        const softban = await message.member.ban({ reason: "[ Anti Spam ]", days: 7 }).catch(() => false)
        if (!softban) {
          await message.member.roles.add("782614716811706369")
          message.channel.send({ embed: { color: '#FF6565', description: `⛔ **\`${message.author.tag}\` as été mute car je n'ai pas pu le kick**` }})
          client.channels.cache.get("782235572273938459").send({ embed: { color: '#FF6565', title: "[ SPAM ]", description: `J'ai mute <@${message.author.id}> car il a envoyé plus de 1 msg/s pendant 10s malgré mes avertissements, je n'ai pas pu l'expulser`, footer: { text: message.author.id } } })
        } else {
          await message.guild.members.unban(message.author.id)
          message.channel.send({ embed: { color: '#FF6565', description: `⛔ **\`${message.author.tag}\` as été expulsé pour spam**` }})
          client.channels.cache.get("782235572273938459").send({ embed: { color: '#FF6565', title: "[ SPAM ]", description: `J'ai expulsé <@${message.author.id}> car il a envoyé plus de 1 msg/s pendant 10s malgré mes avertissements`, footer: { text: message.author.id } } })
        } 
      } else {
        // warn
        message.channel.send({ embed: { color: '#FF6565', description: `⛔ **\`${message.author.tag}\`, merci d'arreter d'envoyer autant de message, je devrais t'expulser la prochaine fois.**` }})
        warnMSG[message.author.id]++
        universalWarnings[message.author.id]++

        setTimeout(() => {
          if (warnMSG[message.author.id] == 0) return
          else warnMSG[message.author.id] = warnMSG[message.author.id] - 1
        }, 5*60*1000)
        setTimeout(() => {
          if (universalWarnings[message.author.id] > 0) universalWarnings[message.author.id]--
        }, 60 * 1000)
      }
    }

    if (!whitelistCommand.includes(message.content.toLowerCase())) {
      // enregistrement du nombre de messages dans les 10 dernières secondes
      if (!spamMessage[message.author.id]) spamMessage[message.author.id] = 0
      spamMessage[message.author.id]++
      setTimeout(() => {
        if (spamMessage[message.author.id] <= 0) return;
        spamMessage[message.author.id]--
      }, 10*1000)
    }

    // insulte
    if (args.some(e => badword.includes(e))) {
      if (!message.member) return
      if (message.member.roles.cache.has("782614716811706369")) return
        message.channel.send(`⛔ **\`${message.author.tag}\`, merci de garder un language correct !**`).then((msg) => msg.delete({ timeout: 10000 }).catch(() => false))
        let data = require(`../../data/${message.author.id}.json`)
        if (!message) return
        if (!data) return
        data.sanctions.avertissements.badword = data.sanctions.avertissements.badword + 1
        await fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
        await deleteCache([`../../data/${message.author.id}.json`])
        client.channels.cache.get("782235572273938459").send(`**${message.author.tag} [ ${message.author.id} ] a envoyer un mot vulgaire dans <#${message.channel.id}>**`)

        universalWarnings[message.author.id]++

        setTimeout(() => {
          if (universalWarnings[message.author.id] > 0) universalWarnings[message.author.id]--
        }, 60 * 1000)
      }
  
      // anti invite
      if (message.content.match(/(https?:\/\/)?(www.)?(discord.(gg|io|me|li)|discordapp.com\/invite)\/.+[a-z]/gi) && !["782235571761315842", "782235571761315843"].includes(message.channel.id) && isNaN(message.channel.name)) {
        if (!message.member) return
        if (message.member.roles.cache.has("782614716811706369")) return
        message.channel.send({embed: {color: '#FF6565', title: `⛔ Tu n'a pas le droit de poster des invitations ici !`}}).then((msg) => msg.delete({ timeout: 10000 }))
        message.delete()
        let data = require(`../../data/${message.author.id}.json`)
        data.sanctions.avertissements.invites = data.sanctions.avertissements.invites + 1
        await fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
        await deleteCache([`../../data/${message.author.id}.json`])
        client.channels.cache.get("782235572273938459").send(`**${message.author.tag} [ ${message.author.id} ] a envoyer une invitation dans <#${message.channel.id}>**`)
        
        universalWarnings[message.author.id]++

        setTimeout(() => {
          if (universalWarnings[message.author.id] > 0) universalWarnings[message.author.id]--
        }, 60 * 1000)
      }

      // mute auto
      if (universalWarnings[message.author.id] >= 5 && !message.member.roles.cache.has("782614716811706369")) {
        if (message.member.roles.cache.has("782614716811706369")) return
        universalWarnings[message.author.id] = 0
        const obj = ({ id: Date.now() + message.author.id, mod: client.user.id, time: 300000, date: Date.now(), reason: "5 avertissements automatiques en moins de 60s", unmute: false, })
        await message.member.roles.add("782614716811706369").catch(() => 0)
        message.author.send({embed: {description: "Tu a été mute sur le serveur The Last Kingdom Of Eden", color: '#FF6565', fields: [{name: "**Temps :**", value: getDuration(Date.now() , (Date.now() + obj.time), `[hh]h et [mm]m`), inline: true},{name: "**Raison :**", value: obj.reason, inline: true}]}}).catch(() => 0)
        message.channel.send({embed: {description: `"${message.author.tag}" **a été mute car il a recu trop d'avertissements automatique en peu de temps.**`, color: '#FF6565'}})
        client.channels.cache.get("782235572273938459").send({embed: { 
          color: '#FF6565', 
          title: "[ MUTE ]", 
          description: `<@${message.author.id}> a été mute par <@${client.user.id}>`, 
          fields: [
            { name: "**Raison :**", value: obj.reason, inline: true},
            { name: "**ID :**", value: obj.id, inline: true},
            { name: "**Temps :**", value: getDuration(Date.now(), Date.now() + obj.time, '[mm]m'), inline: true}
          ],
          footer: { text: message.author.id }
        }
        })
        await ensure(message.author)
        let data = require(`../../data/${message.author.id}.json`)
        if (!data) return message.channel.send("Un problème est survenue en tentant d'enregistrer le mute dans la base de donnée")
        data.sanctions.mute.push(obj)
        fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
        await deleteCache([`../../data/${message.author.id}.json`])
      }
}