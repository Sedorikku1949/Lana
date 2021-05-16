const { sad } = require("./gifData.json")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
  const gif = sad.gifs[Math.floor(Math.random() * sad.gifs.length)]
  message.channel.send({embed: {color: sad.color, description: sad.text.replace("{user}", message.member.displayName), image: {url: gif} }})
  },
    config: {
        name: "sad", aliases: ["pleure", "snif"], category: "gif", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Tristesse...", use: "Aucun argument requis" }, modules: []
    }
};
