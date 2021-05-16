module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      message.channel.send(message.content.slice(prefix.length + command.length + 1))
  },
    config: {
        name: "say", aliases: [], category: "moderation", handler: { deleteInvoke: true, staff: true, dev: false, inPogress: false }, help: { desc: "Permet à Lana d'envoyer un message à votre place", use: "=say <message>" }, modules: []
    }
};