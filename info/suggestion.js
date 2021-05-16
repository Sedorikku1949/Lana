const { client } = require("../../managers/eventsManagers")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      if (!args[0]) return message.channel.send("```Un argument est requis```")
      const msg = await client.channels.cache.get("782235571094945797").send({ embed: {
          title: `Suggestion de ${message.author.username}`,
          description: message.content.slice(prefix.length + command.length + 1),
          footer: {text: message.author.id},
          thumbnail: {url: message.author.displayAvatarURL({size: 2048, dynamic: true, format: "png"})},
          color: "#9DFFC4",
          timestamp: Date.now()
      }})
      await msg.react("782276740638441512")
      await msg.react("782276740331732995")
      message.channel.send("<:tk_yes:782276740638441512>  **Ta suggestion a été envoyé avec succès !**")
      message.delete()
  },
    config: {
        name: "suggestion", aliases: ["suggest"], category: "info", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Permet de donner une suggestion pour le serveur, elle seras visible par tout les membres et le staff", use: "=suggest <suggestion>" }, modules: []
    }
};