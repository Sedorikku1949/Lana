const fs = require("fs")
const b = require("../../functions/guilds/bonus")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        await ensure(message.author)
        const msg = 70 + Math.floor(Math.random() * 400)
        let data = require(`../../data/${message.author.id}.json`)
        if (data.money.hourly > Date.now()) return message.channel.send({ embed: {color: "#2C2F33", description: `> **Tu dois encore attendre ${getDuration(Date.now(), data.money.hourly, "[mm]m")}**`}})
        let bonus = require("../../guild.json").find(e => e.id == data.guild.id)
        bonus = bonus ? bonus.bonus.money : 1
        data.money.cash += msg > 1 ? b("money", msg, bonus) : msg
        data.money.hourly = Date.now() + 3600000
        if (!data.money.rappel) data.money.rappel = { work: false, fish: false, daily: false, hebdo: false, hourly: false }
        data.money.rappel.hourly = false
        if (data.money.cash > 50000  && !data.bio.badges.find(e => e == "3") ) data.bio.badges.push("3")
        fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
        await deleteCache([`../../data/${message.author.id}.json`])
        message.channel.send({ embed: {
            color: "#2C2F33",
            description: `Tu a gagner la modique somme de ${msg}§ ${bonus > 1 && msg > 1 ? `( +${bonus}% )`: "\u200b"}`
        }})
    },
    config: {
        name: "hourly", aliases: [], category: "eco", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Un petit peu d'argent chaque jour, héhé", use: "Aucun argument requis" }, modules: []
    }
}

/**
 * min: 70
 * max: 470
 */