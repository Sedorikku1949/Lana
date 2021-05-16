const obj = require("./subGuilds/shop/shop.json").userShop

const { client } = require("../../managers/eventsManagers")

function increase(x, embed) { return x >= embed.length - 1 ? 0 : x + 1 }
function decrease(x, embed) { return x <= 0 ? x = embed.length - 1 : x - 1 }

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        const emojis = [ '◀️', '▶️', '🔴', '💰' ]
        if (args[0]) {
            // recherche un item précis
        } else {
            let [embed, x] = [obj.map(e => ({embed: { footer: {text: e.id} , color: "#DF8585", thumbnail: { url: client.user.displayAvatarURL({ size: 2048, format: "png" }) } ,fields: [
                { name: "**Nom :**", value: "```\n"+e.item+"```", inline: false},
                { name: "**Petite description :**", value: "```\n"+e.description+"```", inline: false},
                { name: "**Prix :**", value: "```\n"+e.price.shortNumber()+" §```", inline: false},
                { name: "**Conditions :**", value: `\`\`\`\nArgent : ${e.conditions.money.shortNumber()} §\nXP : ${e.conditions.xp.shortNumber()}\nRôle : ${e.conditions.role ? message.guild.roles.cache.get(e.conditions.role).name : "Aucun role requis"}\`\`\``, inline: false},
                { name: "**Réductions :**", value: "```"+ ( e.reduction.length ? e.reduction.map(a => `${message.guild.roles.cache.get(a.role).name} >> -${a.pourcentage}% ( = ${(e.price * a.pourcentage).shortNumber()} § )`) : "Aucune réduction") + "```"}
            ] } })), 0]

            let msg = await message.channel.send({ embed: { color: "#2C2F33", description: "> <a:a_load:826063567258124308> **Chargement de la boutique...**" } })
            await Promise.all(emojis.map((e) => msg.react(e)))

            const filter = (react, user) => react.emoji.name.includes(react.emoji.name) && user.id == message.author.id
            const collector = msg.createReactionCollector(filter, { time: 120000 })
            await msg.edit(embed[x])
            collector.on("collect", async(react) => {
                switch(react.emoji.name) {
                    case '◀️': { 
                        x = decrease(x, embed)
                        await msg.edit(embed[x]).catch(() => false)
                        react.users.remove(message.author.id).catch(() => 0)
                        break
                     }
                    case '▶️': { 
                        x = increase(x, embed)
                        await msg.edit(embed[x])
                        react.users.remove(message.author.id).catch(() => 0)
                        break
                     }
                    case '🔴': { 
                        await msg.reactions.removeAll().catch(() => false)
                        collector.stop()
                        break
                     }
                    case '💰': { 
                        await msg.reactions.removeAll().catch(() => false)
                        await msg.edit({ embed: { color: "#DF8585", description: "> <a:a_load:826063567258124308> **Traitement de la demande...**" } })
                        require("./subGuilds/shop/userShop")(message, embed[x].embed.footer.text, msg)
                     }
                }
            })
            collector.on("end", () => msg.reactions.removeAll().catch(() => 0))
        }
  },
    config: {
        name: "shop", aliases: ["boutique"], category: "guild", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "Quelle magnifique boutique, on y trouve de tout :D", use: "Aucun argument requis" }, modules: []
    }
};