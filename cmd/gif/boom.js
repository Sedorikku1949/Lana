const { boom } = require("./gifData.json")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
  const gif = boom.gifs[Math.floor(Math.random() * boom.gifs.length)]
  message.channel.send({embed: {color: boom.color, description: boom.text.replace("{user}", message.member.displayName), image: {url: gif} }})
  },
    config: {
        name: "boom", aliases: ["explosion"] , category: "gif", handler: { deleteInvoke: true, staff: false, dev: false, inPogress: false }, help: { desc: "Tu vas tout exploser", use: "Aucun argument requis" }, modules: []
    }
};
