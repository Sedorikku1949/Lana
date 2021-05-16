const getCategory = (c) => {
    const str = c.replace(/development|info|musique|guild|moderation|fun|eco|gif|event|casino/gi, (_, grp) => {
        switch (_) { case "casino": return "Casino"; case "guild": return "Guild"; case "gif": return"Gifs"; case "game": return "Jeux" ; case "dev": return "Developpement" ; case "info": return "Informations" ; case "musique": return "Musique" ; case "guild": return "Guild" ; case "moderation": return "Modération" ; case "fun": return "Fun" ; case "eco": return "Economie" ; case "event": return "Events"}
    }) ; return str
}

function increase(x, embed) { return x >= embed.length - 1 ? 0 : x + 1 }
function decrease(x, embed) { return x <= 0 ? x = embed.length - 1 : x - 1 }

function fetchAllCategory(message) {
    let ctg = []
    let cat = []
    client.commands.forEach(e => { if (!ctg.includes(e.config.category)) ctg.push(e.config.category) })
    ctg.forEach(e => {
        if ( ( (e == "moderation" || e == "ticket") && !message.member.roles.cache.has("782235568012001285")) || (e == "dev" && !message.member.roles.cache.has("782235568012001288"))) return
        else cat.push(e)
    })
    return cat
}

function getCommandHelp(args, message) {
    const cmd = client.commands.find(e => e.config.name.includes(args) || (e.config.aliases.length > 0 && e.config.aliases.includes(args)))
    if (message.editedAt) {
        // message edit
        if (!cmd) return message.edit({ embed: { color: "#5865F2", description: "> 🔎 **Je n'ai pas trouvé cette commande**" } })
        message.edit({ embed: {
            color: "#5865F2",
            description: `> **Fiche d'aide la commande \`${cmd.config.name}\` :**`,
            fields: [ { name: "**Catégorie :**", value: getCategory(cmd.config.category), inline: true }, { name: "**Aliase(s) :**", value: cmd.config.aliases.length > 0 ? cmd.config.aliases.join(" / ") : "Aucun aliase.", inline: true}, { name: "**Description :**", value: "```"+cmd.config.help.desc+"```", inline: false }, { name: "**Utilisation :**", value: "```"+cmd.config.help.use+"```", inline: false } ],
            footer: { icon: message.guild.iconURL({ size: 2048, format: "png"}), text: "© The Last Kingdom Of Eden" },
            thumbnail: { url: client.user.displayAvatarURL({ size: 2048, format: "png" }) }
        }})
    } else {
        // send msg
        if (!cmd) return message.channel.send({ embed: { color: "#5865F2", description: "> 🔎 **Je n'ai pas trouvé cette commande**" } })
        message.channel.send({ embed: {
            color: "#5865F2",
            description: `> **Fiche d'aide la commande \`${cmd.config.name}\` :**`,
            fields: [ { name: "**Catégorie :**", value: getCategory(cmd.config.category), inline: true }, { name: "**Aliase(s) :**", value: cmd.config.aliases.length > 0 ? cmd.config.aliases.join(" / ") : "Aucun aliase.", inline: true}, { name: "**Description :**", value: "```"+cmd.config.help.desc+"```", inline: false }, { name: "**Utilisation :**", value: "```"+cmd.config.help.use+"```", inline: false } ],
            footer: { icon: message.guild.iconURL({ size: 2048, format: "png"}), text: "© The Last Kingdom Of Eden" },
            thumbnail: { url: client.user.displayAvatarURL({ size: 2048, format: "png" }) }
        }})
    }
}

function collectorCommandSearch(msg, message, user) {
    return new Promise(async(resolve, reject) => {
        let e = false
        await msg.reactions.removeAll()
        await msg.edit({ embed: { color: "#5865F2", description: "**Quel commande souhaite tu chercher ?**" } })
        const collector = msg.channel.createMessageCollector((m) => m.author.id == message.author.id, { time: 30000 })
        collector.on("collect", (m) => { resolve(m) ; e = true ; collector.stop() })
        collector.on("end", () => { if (!e) resolve(false) } )
    })
}


const { client } = require("../../managers/eventsManagers")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!args[0]) {
            const categorys = fetchAllCategory(message)
            const commandList = categorys.map(e => ({ctg : e, text: "```diff\n- "+(client.commands.filter(cmd => cmd.config.category == e).map(a => a.config.name).join("\n- "))+"```"}))
            const ctg = categorys.map((e, index) => categorys.map(c => c == e ? "**`"+e+"`**" : c))
            const embed = commandList.map(e => e.text).map((list, index) => ({ embed: { footer: { icon: message.guild.iconURL({ size: 2048, format: "png"}), text: "© The Last Kingdom Of Eden" }, thumbnail: { url: client.user.displayAvatarURL({ size: 2048, format: "png" }) }, color: "#5865F2", fields: [{ name: "** **", value: list }], description: ctg[index].splitArray(7).map(z => z.join(" - ") ).join("\n") } }) )
            let [x, msg] = [0, await message.channel.send(embed[0])]
            await Promise.all(["🔡", "🔎", "◀️", "▶️", "🔴"].map((e) => msg.react(e)))
            const collector = msg.createReactionCollector((r, user) => ["🔡", "🔎", "◀️", "▶️", "🔴"].includes(r.emoji.name) && user.id == message.author.id, { time: 60000 })
            collector.on("collect", async(react) => {
                switch(react.emoji.name) {
                    case "🔡": {
                        await msg.edit({ embed: { description: "> **Liste des catégories :**", color: "#5865F2", description: categorys.map(e => `**\`# ${e}\`** >> ${commandList.find(a => a.ctg == e).text.split("-").length} commands`).join("\n") } })
                        collector.stop() ; break;
                    };
                    case "🔎": {
                        const m = await collectorCommandSearch(msg, message, message.author) ; await m.delete() ; getCommandHelp(m.content.toLowerCase().trim(), msg) ; break;
                    };
                    case "◀️": {
                        x = decrease(x, embed) ; msg.edit(embed[x]) ; react.users.remove(message.author.id).catch(() => 0)
                        break;
                    };
                    case "▶️": {
                        x = increase(x, embed) ; msg.edit(embed[x]) ; react.users.remove(message.author.id).catch(() => 0)
                        break;
                    };
                    case "🔴": {
                        collector.stop() ; break;
                    };
                }
            });
            collector.on("end", () => msg.reactions.removeAll().catch(() => false))
        } else {
            getCommandHelp(args[0], message)
        }
    },
    config: {
        name: "help", aliases: ["h"], category: "info", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Tu l'utilise actuellement", use: "=help\n=help <commande>" }, modules: []
    }
};