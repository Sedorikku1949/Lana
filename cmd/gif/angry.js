const { angry } = require("./gifData.json")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
  const gif = angry.gifs[Math.floor(Math.random() * angry.gifs.length)]
  message.channel.send({embed: {color: angry.color, description: angry.text.replace("{user}", message.member.displayName), image: {url: gif} }})
  },
    config: {
        name: "angry", aliases: ["enerve"], category: "gif", handler: { deleteInvoke: true, staff: false, dev: false, inPogress: false }, help: { desc: "Enervé, montre le facilement en général avec cette commande", use: "Aucun argument requis" }, modules: []
    }
};
