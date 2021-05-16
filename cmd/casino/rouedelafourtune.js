const fs = require("fs");
const cases = [...Array(21).keys()].map(e => (e*e)-100)

async function wait(ms) {
    return new Promise((resolve, reject) => setTimeout(() => resolve(true), ms))
}

const cooldown = {}

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (cooldown[message.author.id]) return message.react("❌")
        let data = require(`../../data/${message.author.id}.json`)
        if (!data.casino || data.casino <= 0) return message.channel.send({ embed: { color: "#57F287", description: "> **Tu n'a pas de ticket de casino, achète-en un dans le shop !**" } })
        cooldown[message.author.id] = true
        const msg = await message.channel.send({ embed: { color: "#57F287", description: "*La roue tourne...*" } })
        await wait(3000)
        const price = cases[Math.floor(Math.random() * cases.length)]
        const index = cases.findIndex(e => e == price)
        if (!index || index < 0) return msg.edit({ embed: { color: "#57F287", description: "```\nUne erreur est survenue```" } })
        data.money.cash += price
        data.casino--
        fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
        await deleteCache([`../../data/${message.author.id}.json`])
        await msg.edit({ embed: { color: "#57F287", description: `... Et la roue tombe sur la case ${index} !!\n\n**${price > 0 ? `Tu as gagné ${price}§ !! Bravo pour ce jolie score` : `Malheureusement, tu as perdu ${price * -1}§, courage !`}**` } })
        delete cooldown[message.author.id]
    },
    config: {
        name: "roue", aliases: [], category: "casino", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: true }, help: { desc: "La roue de la fortune c'est trop bien", use: "Aucun argument requis" }, modules: []
    }
};