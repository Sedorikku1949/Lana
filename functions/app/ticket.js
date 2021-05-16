const { client } = require("../../managers/eventsManagers");

module.exports = async (message, user, react) => {
  return new Promise(async (resolve, reject) => {
    if (react) react.users.remove(user).catch(() => 0);
    let chl = message.guild.channels.cache.find((e) => e.name == user.id);
    if (chl) {
      chl.send(`> <@${user.id}>, tu a déjà un ticket qui existe`);
    } else {
      chl = await message.guild.channels.create(user.id, {
        type: "text",
        reason: `Création de ticket pour ${user.tag}`,
        parent: message.guild.channels.cache .filter((e) => e.type === "category") .find((e) => e.name == "Tickets"),
        permissionOverwrites: [
            { id: "782235568012001285", allow: ["VIEW_CHANNEL", "SEND_MESSAGES"], },
            { id: user.id, allow: ["VIEW_CHANNEL", "SEND_MESSAGES"] },
            { id: message.guild.roles.everyone.id, deny: ["VIEW_CHANNEL", "SEND_MESSAGES"], },
        ],
      });
      chl.send(`📃 **J'ai créer un ticket pour <@${user.id}>**\n\n@here`);
    };
    resolve(true)
  });
};
