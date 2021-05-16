function removeUnicode(str) {
    return str.replace(/\%20|\%C3\%A9|\%C3\%A0|\%2C|\%C3\%A8|\%3D|\%3E|\%40|\%C3\%B4|\%2B|`/g, (grp, _) => { switch(grp) {case "%20": return " "; case "%C3%A9": return "é"; case "%C3%A0": return "à"; case "%2C": return ","; case "%C3%A8": return "è"; case "%3D": return "="; case "%3E": return ">"; case "%40": return "@"; case "%C3%B4": return "ô";  case "%2B": return "+"; case "`": return "\`" } })
}

function increase(x, embed) { return x >= embed.length - 1 ? 0 : x + 1 }
function decrease(x, embed) { return x <= 0 ? x = embed.length - 1 : x - 1 }

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      let msg = await message.channel.send({ embed: { color: "#ED4245", description: "> <a:tk_load:826063567258124308> **Chargement des données...**" }})
      let ban = await message.guild.fetchBans()
      ban = ban.map(e => ({name: `[ ${e.user.tag} | ${e.user.id} ]`, value: `\`\`\`${removeUnicode(e.reason ? e.reason : "Aucune raison fournie")}\`\`\``, inline: false}))
      ban = ban.splitArray(5).map((e, index) => ({ embed: { color: "#ED4245", fields: e, title: `[ #${index + 1} / ${ban.splitArray(5).length} ]`}}))
      let x = 0
      if (ban.length >= 2) {
          await msg.react("◀️")
          await msg.react("▶️")
          await msg.react("🔴")
          const filter = (reaction, user) => ["🔴", "▶️", "◀️"].includes(reaction.emoji.name) && user.id == message.author.id
          const collector = msg.createReactionCollector(filter, { time: 120000 })
          await msg.edit(ban[x])
          collector.on("collect", (react) => {
              switch(react.emoji.name) {
                  case "🔴": {
                      collector.stop()
                      break
                }
                  case "▶️": {
                    x = increase(x, ban)
                    msg.edit(ban[x])
                    react.users.remove(message.author.id).catch(() => 0)
                    break
                }
                  case "◀️": {
                    x = decrease(x, ban)
                    msg.edit(ban[x])
                    react.users.remove(message.author.id).catch(() => 0)
                    break
                }
              }
          })
          collector.on("end", () => msg.reactions.removeAll().catch(() => 0))
      } else {
          msg.edit(ban[x])
      }
  },
    config: {
        name: "seeban", aliases: ["sb"], category: "moderation", handler: { deleteInvoke: false, staff: true, dev: false, inPogress: false }, help: { desc: "Affiche tout les bans du serveur", use: "Aucun argument requis" }, modules: []
    }
};