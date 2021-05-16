const start = Date.now()
const Discord = require("discord.js")
const client = new Discord.Client()
const fs = require("fs")
const config = require("../config.json")
const chalk = require("chalk")

module.exports = {
    client: client,
    start: start,
}

client.prefix = config.prefix
let error = []

fs.readdirSync("listeners").forEach((dir) => {
    if (dir.match(/\./g)) return console.log(chalk.yellow(`{ WARNING }  >>  The file "listeners/${dir}" has been ignored by the event loader`))
    if (!fs.existsSync(`listeners/${dir}/exe.js`)) return console.log(chalk.red(`{ ERROR }  >>  The folder "listeners/${dir}" doesn't have a file named "exe.js"`))
    try { client.on(dir, require(`../listeners/${dir}/exe.js`)); console.log(chalk.blue(`{ EVENTS }  >> The event "listeners/${dir}" loaded successfully at "listeners/${dir}/exe.js"`)) } catch(err) { console.log(chalk.red(`{ EVENT ERROR }  >>  An error as occured when loading "listeners/${dir}/exe.js""`)); error.push({file: `dir/exe.js`, error: err}) }
})

if (error.length > 0) {
    console.log(chalk.red(`Résumé des erreurs :\n${error.map(e => require("util").inspect(e)).join("\n")}`))
}

client.data = new Map(); client.queue = []; client.music = {}
fs.readdirSync("data").forEach(async (dir) => client.data.set(dir.replace(".json", ""), require(`../data/${dir}`)))
client.stats = { global: {}, user: {}, channel: {}, join: {}, leave: {}, vocal: {}}
require("../functions/proto/prototype")
require("../functions/load")()
client.commands = require("./commandsManager").init()
client.ia = {}

client.login(config.token)