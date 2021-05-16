const { client } = require("../../managers/eventsManagers")
const badword = require("../../badword.json")
const letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J','K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T','U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '&' ]

function getRandomLetters(nb) {
    let str = "";
    for (let i = 0; i < nb; i++) { str = str + ( letters[Math.floor(Math.random() * letters.length)] ) };
    return "||"+str+"||";
}

function replaceBadword(str) {
    return str.replace(new RegExp(badword.join("|"), "gm"), (a,b) => getRandomLetters(a.length))
}

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      if (!args[0]) return message.channel.send("```Un argument est requis```")
      await client.channels.cache.get("818106794856677386").send({ embed: {
          title: `Avis de ${message.author.username}`,
          description: replaceBadword(message.content.slice(prefix.length + command.length + 1)),
          footer: {text: "Merci de nous avoir donnés ton avis !"},
          thumbnail: {url: message.author.displayAvatarURL({size: 2048, dynamic: true, format: "png"})},
          color: "#2C2F33",
          timestamp: Date.now()
      }})
      message.delete()
      message.channel.send("> **Merci de nous avoir donnés ton avis !**")
  },
    config: {
        name: "avis", aliases: [], category: "info", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: true }, help: { desc: "Tu peux donner un avis sur le serveur :D", use: "=avis <avis>" }, modules: []
    }
};