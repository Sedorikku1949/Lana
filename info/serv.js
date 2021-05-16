const { client } = require("../../managers/eventsManagers")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      const time = Date.now() - message.guild.createdTimestamp
      message.channel.send({ embed: {
          title: message.guild.name,
          thumbnail: {url: message.guild.iconURL({size: 2048, dynamic: true, format: "png"})},
          fields: [
              {name: "**Création du serveur :**", value: `\` le ${getDate(message.guild.createdTimestamp, `[DD]/[MM]/[YYYY] à [hh]:[mm]`)}\` \n ( il y a ${getDuration(time, Date.now(), "[DD] jours et [hh]h")} jours )`, inline: true},
              {name: "**Owner :**", value: `<@${message.guild.owner.id}>`, inline: true},
              {name: "**Quelques infos :**", value: ` \`${message.guild.channels.cache.size}\` **salons** \n \`${message.guild.roles.cache.size}\` **roles** \n \`${message.guild.memberCount - message.guild.members.cache.filter(e => e.user.bot).size}\`** membres** \n \`${message.guild.members.cache.filter(e => e.user.bot).size}\` **bots**`, inline: false},
              {name: "**Boosts :**", value: `${message.guild.premiumSubscriptionCount} boosts / niveau ${message.guild.premiumTier}`}
          ],
          color: "#9DFFC4",
          image: {url: message.guild.bannerURL() ? message.guild.bannerURL() : "https://media.discordapp.net/attachments/801455946882613249/818822574914011156/pub.jpg?width=1203&height=676"}
      }})
  },
    config: {
        name: "serv", aliases: ["server", "si"], category: "info", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Affiche les infos sur le serveur", use: "Aucun argument requis" }, modules: []
    }
};