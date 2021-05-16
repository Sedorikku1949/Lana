const { client } = require("../../managers/eventsManagers")
const fs = require("fs")
const { ensure } = require("../../config.json")

module.exports = async (user) => {
    return new Promise((resolve, reject) => {
        ensure.id = user.id
        if (!client.data.get(user.id)) fs.writeFileSync(`data/${user.id}.json`, JSON.stringify(ensure, null, 1))
        fs.readdirSync("data").forEach(async (dir) => client.data.set(dir.replace(".json", ""), require(`../../data/${dir}`)))
        resolve(true)
    })
}
