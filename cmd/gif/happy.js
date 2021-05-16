const { happy } = require("./gifData.json")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
  const gif = happy.gifs[Math.floor(Math.random() * happy.gifs.length)]
  message.channel.send({embed: {color: happy.color, description: happy.text.replace("{user}", message.member.displayName), image: {url: gif} }})
  },
    config: {
        name: "happy", aliases: ["joy", "heureux"], category: "gif", handler: { deleteInvoke: true, staff: false, dev: false, inPogress: false }, help: { desc: "Tu es heureux(se) ?", use: "Aucun argument requis" }, modules: []
    }
};
