const ensure = require("./ensure")
const fs = require("fs")
const cooldown = {}

module.exports = async(message) => {
    if (!message.webhookID) return
    if (!message.content.startsWith("Le")) return
    const user = message.guild.members.cache.select(message.content.split("**")[1], false, false, false)
    if (!user) return message.react("❌")
    if (cooldown[user.id] > Date.now()) return message.channel.send({ embed: { color: "#2C2F33", description: `> **Tu dois encore attendre ${getDuration(Date.now(), cooldown[user.id], "[hh]h et [mm]m")}**`, footer: {text: "détection de tentative de triche du système de récompense"} }})
    await ensure(user)
    let data = require(`../../data/${user.id}.json`)
    data.money.cash += 50
    fs.writeFileSync(`data/${user.id}.json`, JSON.stringify(data, null, 1))
    message.channel.send({ embed: {description: `> **Merci à \`${user.user.username}\` d'avoir voter, nous t'offrons 50§ pour te remercier**`, color: "#2C2f33"} })
    cooldown[user.id] = Date.now() + 5400000
}