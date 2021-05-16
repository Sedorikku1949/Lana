const fs = require("fs");
const emojis = [ '💰', '🪙', '🎱' ]

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        let data = require(`../../data/${message.author.id}.json`)
        if (!data.casino || data.casino <= 0) return message.channel.send({ embed: { color: "#57F287", description: "> **Tu n'a pas de ticket de casino, achète-en un dans le shop !**" } })
        let a = emojis[Math.floor(Math.random() * emojis.length)]
        let b = emojis[Math.floor(Math.random() * emojis.length)]
        let c = emojis[Math.floor(Math.random() * emojis.length)]

        if (a == b && b == c) {
            // win
            // money++++
            const price = Math.floor(Math.random() * 7000) + 3000
            data.money.cash += price
            data.casino--
            fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
            await deleteCache([`../../data/${message.author.id}.json`])
            message.channel.send({ embed: {
                author: { name: message.author.tag },
                color: "#57F287",
                description: `\`\`\`\n==========\`\`\`** **${a}|${b}|${c}\n\`\`\`\n==========\`\`\`\nFélicitation !\n> **Tu gagne ${price}§.**`
            }})
        } else if ( ( a == b && b !== c ) || ( b == c && c !== a ) || ( c == a && a !== b) ) {
            // money == 0
            data.casino--
            fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
            await deleteCache([`../../data/${message.author.id}.json`])
            message.channel.send({ embed: {
                author: { name: message.author.tag },
                color: "#57F287",
                description: `\`\`\`\n==========\`\`\`** **${a}|${b}|${c}\n\`\`\`\n==========\`\`\`\nPas de chance...\n> **Tu n'a rien gagné.**`
            }})
        } else if (a !== b && b !== c) {
            // money--
            const price = Math.floor(Math.random() * -500) - 100
            data.money.cash += price
            data.casino--
            fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
            await deleteCache([`../../data/${message.author.id}.json`])
            message.channel.send({ embed: {
                author: { name: message.author.tag },
                color: "#57F287",
                description: `\`\`\`\n==========\`\`\`** **${a}|${b}|${c}\n\`\`\`\n==========\`\`\`\nAïe aïe aïe...\n> **Tu as perdu(e) ${-price}§**`
            }})
        }
    },
    config: {
        name: "roulette", aliases: [], category: "casino", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: true }, help: { desc: "Une roulette pardi !", use: "Aucun argument requis" }, modules: []
    }
};