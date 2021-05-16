const { client } = require("../../managers/eventsManagers")

module.exports = async(invite) =>  client.invites = await client.guilds.cache.get("782235567970713620").fetchInvites()