const fs = require("fs")
const { client } = require("../../managers/eventsManagers")

module.exports = (error) => {
    if (String(error).length <= 0) return " "
    const err = String(error).split("\n")
    if (!err || err.length <= 0) return "ANALYSE ERROR"
    const data = require("../../logs.json")
    data[Date.now()] = String(error)
    fs.writeFileSync("logs.json", JSON.stringify(data, null, 1))
    return `Chemin: ${err.some(e => e.startsWith("at")) ? err[0] : "chemin non detecté" }\n          Error: ${err[4] ? err[4] : err[0]}\n          More details: logs.json [${Date.now()}]`
}