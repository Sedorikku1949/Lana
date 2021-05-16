const { honteux } = require("./gifData.json")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
  const gif = honteux.gifs[Math.floor(Math.random() * honteux.gifs.length)]
  message.channel.send({embed: {color: honteux.color, description: honteux.text.replace("{user}", message.member.displayName), image: {url: gif} }})
  },
    config: {
        name: "honteux", aliases: [], category: "gif", handler: { deleteInvoke: true, staff: false, dev: false, inPogress: false }, help: { desc: "Je trouve ca honteux, pas toi ?", use: "Aucun argument requis" }, modules: []
    }
};
