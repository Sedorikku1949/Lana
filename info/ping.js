const { client } = require("../../managers/eventsManagers")

function checkPing(ping) {
    if (ping < 150) return "excellent";
    else if (ping < 250) return "correcte";
    else if (ping < 400) return "médiocre";
    else if (ping < 1000) return "limite";
    else return "horrible !";
}

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      message.channel.send(`> **🏓 PONG ! j'ai actuellement une latence de ${client.ws.ping}ms, c'est ${checkPing(client.ws.ping)}**`)
  },
    config: {
        name: "ping", aliases: [], category: "info", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Permet de connaitre la latence de Lana", use: "Aucun argument requis" }, modules: []
    }
};