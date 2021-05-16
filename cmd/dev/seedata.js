function increase(x, embed) { return x >= embed.length - 1 ? 0 : x + 1 }
function decrease(x, embed) { return x <= 0 ? x = embed.length - 1 : x - 1 }
const fs = require("fs")
const inspect = require("util").inspect

async function seeAllData(message, args, modules, prefix, command) {
      let msg = await message.channel.send({ embed: { color: "#2C2F33", description: "> <a:tk_load:826063567258124308> **Chargement des données...**" }})
      let ban = []
      fs.readdirSync("data").forEach((e) => { if (!e.endsWith(".json")) return ; ban.push(require(`../../data/${e}`)) })
      ban = ban.map(e => ( { name: `[ ${e.id} ]`, value: `\`\`\`js\n${inspect(e)}\`\`\``, inline: false } ))
      ban = ban.splitArray(1).map((e, index) => ( { embed: { color: "#2C2F33", fields: e, title: `[ #${index + 1} / ${ban.splitArray(1).length} ]`}} ))
      let x = 0
      if (ban.length >= 2) {
          await msg.react("◀️") ; await msg.react("▶️") ; await msg.react("🔴")
          const filter = (reaction, user) => ["🔴", "▶️", "◀️"].includes(reaction.emoji.name) && user.id == message.author.id
          const collector = msg.createReactionCollector(filter, { time: 60000 })
          await msg.edit(ban[x])
          collector.on("collect", (react) => {
              switch(react.emoji.name) {
                  case "🔴": { collector.stop() ; break }
                  case "▶️": { x = increase(x, ban) ; msg.edit(ban[x]) ; react.users.remove(message.author.id).catch(() => 0); break }
                  case "◀️": { x = decrease(x, ban) ; msg.edit(ban[x]) ; react.users.remove(message.author.id).catch(() => 0) ; break }
              }
          })
          collector.on("end", () => msg.reactions.removeAll().catch(() => 0))
      } else {
          msg.edit(ban[x])
      }
}

async function seeSpecificData(message, args, modules, prefix, command, key) {
    try {
        var data = require(`../../data/${key}.json`)
    } catch (error) {
        return message.channel.send({ embed: { color: "#2C2F33", title: "LOADING ERROR" ,description: `> **Je n'arrive pas à trouver la data key demandé avec \`${args[0]}\`**` } })
    }
    if (!data) return
    message.channel.send({ embed: { color: "#2C2F33", title: `[ ${data.id} ]` ,description: "```js\n"+inspect(data)+"```" } })
}

async function resetUserData(message, args, modules, prefix, command, key) {
    try {
        var data = require(`../../data/${key}.json`)
    } catch (error) {
        return message.channel.send({ embed: { color: "#2C2F33", title: "LOADING ERROR" , description: `> **Je n'arrive pas à trouver la data key demandé avec \`${args[1]}\`**` } })
    }
    if (!data) return
    let msg = await message.channel.send({ embed: { color: "#2C2F33",  description: `> **veux tu réellement réinitialiser la clé \`${args[1]}\` ? Toutes les données seront perdus à jamais, y compris les sanctions.**` } })
    let x = 0
    await msg.react("782276740638441512") ; await msg.react("782276740331732995")
    const filter = (react, user) => ["tk_yes", "tk_no"].includes(react.emoji.name) && user.id == message.author.id
    const collector = msg.createReactionCollector(filter, { time: 60000 })
    collector.on("collect", async(react) => {
        if (react.emoji.name == "tk_yes") {
            fs.writeFileSync(`data/${data.id}.json`, JSON.stringify(require("../../config.json").ensure, null, 1))
            await msg.edit({ embed: { color: "#2C2F33", description: `> **La clé \`${args[1]}\` a été réinitialisé avec succès !**` }})
            collector.stop()
        } else if (react.emoji.name == "tk_no") {
            msg.edit({ embed: { color: "#2C2F33", description: "> **Annulation de l'action**" }})
        }
    })
    collector.on("end", () => msg.reactions.removeAll().catch(() => {}))
}



module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      if (!args[0]) return seeAllData(message, args, modules, prefix, command)
      else if (args[0] == "reset" && !isNaN(args[1])) return resetUserData(message, args, modules, prefix, command, args[1])
      else if (!isNaN(args[0])) return seeSpecificData(message, args, modules, prefix, command, args[0])
      else return message.channel.send({ embed: { color: "#2C2F33", description: `> **Je n'arrive pas à trouver la data key demandé avec \`${args[0]}\`**` } })
    },
    config: {
        name: "seedata", aliases: ["sd"], category: "dev", handler: { deleteInvoke: false, staff: false, dev: true, inPogress: false }, help: { desc: "Une commande pour gérer la base de donnée, réservée aux devs, et uniquement eux !", use: "=sd\n=sd <reset> <id>\n=sd <id>" }, modules: []
    }
};