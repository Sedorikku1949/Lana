const { resolveTxt } = require('dns')
const { inspect } = require('util')
const { client } = require("../../managers/eventsManagers")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        if (!args[0]) return

        const exit = async (string) => {
            let text = string
            if (typeof text !== 'string') text = String(require('util').inspect(string))
            return text
                .replace(new RegExp(`${client.token}|client\.token|\@|token`, "g"), (one, two) => {
                    if (![client.token, "client.token", "@"].includes(one)) return one
                    switch (one) {
                        case "client.token": return "'Tok3n <3'";
                        case client.token: return "'Tok3n <3'";
                        case "@": return "@\u200b";
                        case "token": return "'tokenn'"
                    }
                })
                .slice(0, 1986)
        }
        try {
            const code = message.content.slice(prefix.length + command.length + 1)
            const exec = async () => await eval(await exit(code))
            let msg = await message.channel.send(`**\`SUCCESS\`**\n\`\`\`js\n${(await exit(await exec())).slice(0,1900)}\`\`\``)
            await msg.react('🗑️')
            const collector = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '🗑️' && user.id === message.author.id, { time: 2 * 60 * 1000 })
            await collector.on('collect', async (react) => {
                if (react.emoji.name == '🗑️') {
                    await msg.delete().catch(() => 0)
                    collector.stop()
                }
            })
            collector.on('end', (collected) => msg.reactions.removeAll().catch(() => 0))
        } catch (err) {
            let emsg = await message.channel.send(`**\`ERROR\`**\n\`\`\`js\n${(await exit(err)).slice(0,1900)}\`\`\``)
            await emsg.react('🗑️')
            const collector = emsg.createReactionCollector((reaction, user) => reaction.emoji.name === '🗑️' && user.id === message.author.id, { time: 2 * 60 * 1000 })
            await collector.on('collect', async (react) => {
                if (react.emoji.name == '🗑️') {
                    await emsg.delete().catch(() => 0)
                    collector.stop()
                }
            })
            collector.on('end', (collected) => emsg.reactions.removeAll().catch(() => 0))
        }
    },
    config: {
        name: "eval", aliases: ["e"], category: "dev", handler: { deleteInvoke: false, staff: false, dev: true, inPogress: false }, help: { desc: "Une commande très dangereuse que les devs utilisent pour executer du code avec un simple message", use: "=eval <code>" }, modules: []
    }
}