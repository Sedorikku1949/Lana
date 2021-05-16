const { client } = require("../../managers/eventsManagers")

module.exports = async(debug) => {
    if (!client || !client.channels.cache.get("834112549691326524")) return
    client.channels.cache.get("834112549691326524").send({ embed: {
        color: "#2C2F33",
        description: "```\n" + require("util").inspect(debug).replace("'", "") + "```"
    }})
}