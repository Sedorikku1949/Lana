const { client } = require("../../managers/eventsManagers")
const { dev } = require("../../config.json")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      message.channel.send({embed: {
          title: `Information sur "${client.user.tag}"`,
          fields: [
              { name: "**Création du bot :**", value: "\`"+getDate(client.user.createdTimestamp, `[DD]/[MM]/[YYYY] à [hh]:[mm] et [ss]s`) + "\`" + ` \n( il y a ${getDuration(client.user.createdTimestamp, Date.now(), "[DD]")} jours )`, inline: true},
              { name: "**Versions :**", value: `**\`- NodeJS :\`** ${process.version} \n **\`- Discord.js :\`** ${require("discord.js").version}`, inline: true},
              { name: "**Développeurs :**", value: dev.map(e => `<@${e}>`).join("\n"), inline: false},
          ],
          timestamp: Date.now(),
          color: "#9DFFC4",
          thumbnail: {url: client.user.displayAvatarURL({size: 2048, dynamic: true, fomat: 'png'})}
      }})
  },
    config: {
        name: "bot", aliases: ["e"], category: "info", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "It's me", use: "Aucun argument requis" }, modules: []
    }
};