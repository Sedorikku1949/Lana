const { fish } = require("./msg.json")
const fs = require("fs")
const b = require("../../functions/guilds/bonus")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        await ensure(message.author)
        const msg = pourcentage(fish.messages.map(e => ({ text: e.text, price: e.price}) ), fish.messages.map(e => e.pourcentage))
        if (!msg) return message.channel.send({ embed: { color: "#2C2F33", description: "```\nUne erreur survenue, merci de refaire la commande```" } })
        let data = require(`../../data/${message.author.id}.json`)
        if (data.money.fish > Date.now()) return message.channel.send({ embed: {color: "#2C2F33", description: `> **Tu dois encore attendre ${getDuration(Date.now(), data.money.fish, "[hh]h et [mm]m")}**`}})
        let bonus = require("../../guild.json").find(e => e.id == data.guild.id)
        bonus = bonus ? bonus.bonus.money : 1
        data.money.cash += msg.price > 1 ? b("money", msg.price, bonus) : msg.price
        data.money.fish = Date.now() + 43200000
        if (!data.money.rappel) data.money.rappel = { work: false, fish: false, daily: false, hebdo: false, hourly: false }
        data.money.rappel.fish = false
        if (data.money.cash > 50000  && !data.bio.badges.find(e => e == "3") ) data.bio.badges.push("3")
        fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
        await deleteCache([`../../data/${message.author.id}.json`])
        message.channel.send({ embed: {
            thumbnail: { url: "https://images-eu.ssl-images-amazon.com/images/I/71pn1ut-QcL.png" },
            color: fish.color,
            description: msg.text,
            footer: { text: `Tu a ${msg.price > 0 ? "gagné(e)" : "perdu(e)"} ${msg.price > 0 ? msg.price : ( msg.price * -1 )}§ ${bonus > 1 && msg.price > 1 ? `( +${bonus}% )`: "\u200b"}`}
        }})
    },
    config: {
        name: "fish", aliases: [], category: "eco", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Aller, tout le monde à la pêche !", use: "Aucun argument requis" }, modules: []
    }
}