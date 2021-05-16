const fs = require("fs")
const { client } = require("../managers/eventsManagers")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        await client.channels.cache.get("782235570583633963").messages.fetch("834687129920864297")
        console.log(await getReactedUsers(await client.channels.cache.get("782235570583633963").messages.cache.get("834687129920864297"), "782235570583633963", "834687129920864297", "🎉"))
    },
    config: {
        name: "test", aliases: [], category: "dev", handler: { deleteInvoke: false, staff: false, dev: true, inPogress: false }, help: { desc: "...", use: "..." }, modules: []
    }
}