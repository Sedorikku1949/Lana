const { punch } = require("./gifData.json")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
  const gif = punch.gifs[Math.floor(Math.random() * punch.gifs.length)]
  message.channel.send({embed: {color: punch.color, description: punch.text.replace("{user}", message.member.displayName), image: {url: gif} }})
  },
    config: {
        name: "punch", aliases: ["patate", "frappe", "droite"], category: "gif", handler: { deleteInvoke: true, staff: false, dev: false, inPogress: false }, help: { desc: "Ca fait mal-", use: "Aucun argument requis" }, modules: []
    }
};
