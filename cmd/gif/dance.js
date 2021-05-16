const { dance } = require("./gifData.json")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
  const gif = dance.gifs[Math.floor(Math.random() * dance.gifs.length)]
  message.channel.send({embed: {color: dance.color, description: dance.text.replace("{user}", message.member.displayName), image: {url: gif} }})
  },
    config: {
        name: "dance", aliases: ["danse"], category: "gif", handler: { deleteInvoke: true, staff: false, dev: false, inPogress: false }, help: { desc: "Tu danse comme un dieu", use: "Aucun argument requis" }, modules: []
    }
};
