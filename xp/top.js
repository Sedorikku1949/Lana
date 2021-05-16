const { client } = require("../../managers/eventsManagers")
const fs = require("fs")

function topList(rang) { if (rang == 1) return "🥇 " + rang ; else if (rang == 2) return "🥈 " + rang ; else if (rang == 3) return "🥉 " + rang ; else return rang }

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      data = []
      fs.readdirSync("data").forEach((e) => data.push(require(`../../data/${e}`)))
      if (data.length <= 0) return message.channel.send({ embed: { color: "#2C2F33", description: "**Je n'arrive pas à charger la base de donnée ou elle est vide !**"  }})
      if (!args[0]) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nJe ne sais pas quel classement tu veux voir, tu peux donner en argument \"money\", \"guild\" ou \"xp\"```" } })

      switch(args[0]) {
        case "money": {
          const top = data.filter(e => message.guild.members.cache.get(e.id)).sort((a,b) => b.money.cash - a.money.cash);
          await message.channel.send({ embed : {
            color: "#81D3FF",
            author: { name: 'Classement de l\'argent :' },
            description: top.slice(0, 10).map((e, index) => `\`#${topList(index + 1)}\`: **${message.guild.members.cache.select(e.id, false, false, true).user ? message.guild.members.cache.select(e.id, false, false, true).user.tag : message.guild.members.cache.select(e.id, false, false, true).tag}** >> ${e.money.cash}§`).join("\n"),
            fields: [
              { name: "**Ton rang :**", value: topList(top.findIndex(e => e.id == message.author.id) + 1) , inline: false },
            ]
          } });
          break;
        };
        case "xp": {
          const top = data.filter(e => e.xp.xp !== 0 && message.guild.members.cache.get(e.id)).sort((a,b) => b.xp.xp - a.xp.xp);
          await message.channel.send({ embed : {
            color: "#81D3FF",
            author: { name: 'Classement de l\'xp :' },
            description: top.slice(0, 10).map((e, index) => `\`#${topList(index + 1)}\`: **${message.guild.members.cache.select(e.id, false, false, true).user ? message.guild.members.cache.select(e.id, false, false, true).user.tag : message.guild.members.cache.select(e.id, false, false, true).tag}** \n** **    lvl \`${e.xp.lvl}\` >> \`${e.xp.xp}\` pts d'xp`).join("\n"),
            fields: [
              { name: "**Ton rang :**", value: topList(top.findIndex(e => e.id == message.author.id) + 1) , inline: false },
            ]
          }});
          break;
        };
        case "guild": {
          const guild = require("../../guild.json")
          const myData = require(`../../data/${message.author.id}.json`)
          const myGuild = guild.findIndex(e => e.id == myData.guild.id)
          const top = guild.sort((a,b) => (b.pts.pgm + Math.floor(b.pts.pgg / 2)) - (a.pts.pgm + Math.floor(b.pts.pgg / 2)))
          await message.channel.send({ embed : {
            color: "#81D3FF",
            author: { name: 'Classement des guilds :' },
            description: top.slice(0, 10).map((e, index) => `\`#${topList(index + 1)}\`: **${e.name}** \n** **    rank \`${e.rank}\` >> \`${e.pts.pgm}\` pts mensuels`).join("\n"),
            fields: [
              { name: "**Le rang de ta guild :**", value: myGuild >= 0 ? topList(myGuild + 1) : "Tu n'est dans aucune guild !" , inline: false },
            ]
          }});
          break;
        }
        default: message.channel.send({ embed: { color: "#2C2F33", description: "**Je n'ai pas compris quel classement tu veux voir**" } })
      }
    },
    config: {
        name: "top", aliases: [], category: "eco", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Affiche le classement des personnes", use: "=top guild\n=top xp\n=top money" }, modules: []
    }
  };