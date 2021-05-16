const { client } = require("../../managers/eventsManagers")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      if (!args[0]) return message.channel.send("```\n Argument needed```")
      switch (args[0]) {
        case "watch" || "regarde": {
          await client.user.setActivity(message.content.slice(prefix.length + command.length + args[0].length + 2), { type: "WATCHING" });
          message.channel.send(`<:tk_yes:782276740638441512> **J'ai changé le statut avec succès !**`)
          break;
        }
        case "listen" || "écoute": {
          await client.user.setActivity(message.content.slice(prefix.length + command.length + args[0].length + 2), { type: "LISTENING" });
          message.channel.send(`<:tk_yes:782276740638441512> **J'ai changé le statut avec succès !**`)
          break;
        }
        case "play" || "joue": {
          await client.user.setActivity(message.content.slice(prefix.length + command.length + args[0].length + 2), { type: "PLAYING" });
          message.channel.send(`<:tk_yes:782276740638441512> **J'ai changé le statut avec succès !**`)
          break;
        }
        default: {
          await client.user.setActivity(message.content.slice(prefix.length + command.length + 1), { type: "WATCHING" });
          message.channel.send(`<:tk_yes:782276740638441512> **J'ai changé le statut avec succès !**`)
        }
      }
    },
    config: {
        name: "statut", aliases: [], category: "dev", handler: { deleteInvoke: false, staff: true, dev: true, inPogress: false }, help: { desc: "Permet simplement de changer le statut de Lana :D", use: "=statut <type ( facultatif )> <statut>" }, modules: []
    }
  };
  