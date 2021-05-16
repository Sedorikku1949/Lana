const chalk = require("chalk")
const { client } = require("../managers/eventsManagers")
const fs = require("fs")

const ignoreCategorie = ["moderation", "dev", "gif"]
const ignoreChannel = [ "782235571094945794" , "836515060124745769", "782235571761315848"]
const blacklistFolder = ["subWarnings", "subGuilds"]

function getArgs(message, prefixes) {
    if (!prefixes || typeof prefixes !== "object") throw new Error("Invalid Prefix Value");
    const content = message.content.toLowerCase();
    for (const prefix_ of prefixes)
        if (content.startsWith(prefix_)) {
            var PREFIX = content.slice(0, prefix_.length);
            var command = content.slice(prefix_.length).trim().split(/\s+/g)[0];
            var args = content.slice(prefix_.length + command.length + 1).trim().split(/\s+/g);
        }
    return { prefix: PREFIX, command: command, args: args };
};

const errorLog = []

module.exports = {
    init: () => {
        const cmd = []
        function getFiles(dir) {
            fs.readdirSync(dir).forEach((subdir) => {
                if (subdir.match(/\.js/g) && !subdir.match(/\.json/g)) try { cmd.push(require(`../${dir}/${subdir}`)); } catch(err) { console.log(chalk.red(`{ ERROR }  >>  An error as occured when loading "${dir}/${subdir}"`)); errorLog.push({file: `${dir}/${subdir}`, error: err}) }
                else if (subdir.match(/\./g) || blacklistFolder.includes(subdir) || subdir.startsWith("sub")) return
                else getFiles(`${dir}/${subdir}`)
            })
        }
        getFiles("cmd")
        console.log(`${cmd.length} commands has been loaded`)
        console.log(chalk.red(`Résumé des erreurs :\n${errorLog.length > 0 ? errorLog.map(e => `{ file: ${e.file}, error: ${e.error} }`).join('\n\n') : "Aucune erreur"}`))
        return cmd
    },
    execute: (message) => {
        const { prefix, command, args } = getArgs(message, client.prefix)
        if (!prefix || !command) return
        
        const commandToExport = client.commands.find(e => { if (e.config.name == command || e.config.aliases.length > 0 && e.config.aliases.includes(command)) return e })
        if (!commandToExport) return

        if (message.guild.id !== "796376442866368513" && commandToExport.config.handler.staff && !message.member.roles.cache.has("782235568012001285")) return message.channel.send({ embed: { color: '#FF6565', description: "> **⛔ Cette commande est réservée aux modérateurs !**" } })
        if (message.guild.id !== "796376442866368513" && commandToExport.config.handler.dev && !message.member.roles.cache.has("782235568012001288")) return message.channel.send({ embed: { color: '#FF6565', description: "> **⛔ Cette commande est réservée aux développeurs !**" } })
        if (message.guild.id !== "796376442866368513" && commandToExport.config.handler.inPogress && !message.member.roles.cache.has("782235568012001285") && message.channel.id !== "836515060124745769") return message.channel.send({ embed: { color: '#FF6565', description: "> **⛔ Cette commande est encore en développement !**" } })
        if (message.guild.id !== "796376442866368513" && !message.member.roles.cache.has("782235568012001285") && !ignoreCategorie.includes(commandToExport.config.category) && !ignoreChannel.includes(message.channel.id)) return
        
        try { commandToExport.exe(message, args, [], prefix, command) ; if (commandToExport.config.handler.deleteInvoke) message.delete().catch(() => false) }
            catch(err) { console.log(chalk.red(`{ ERROR }  >>  An error as occured when executing the command "${commandToExport.config.name}" :\n${err}`)) }

        console.log(`{ COMMAND EXECUTOR } ${chalk.yellow(`< ${getDate(Date.now(), `[DD]/[MM]/[YYYY] à [hh]:[mm] et [ss]:[ms]`)} | ${Date.now()} >`)} command "${commandToExport.config.name}" executed by ${chalk.cyan(`${message.author.tag} / ${message.author.id}`)} in ${chalk.blue(`( #${message.channel.name} | ${message.channel.id} )`)}`)
    }
}