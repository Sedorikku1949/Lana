const obj = require("./shop.json").userShop
const fs = require("fs")

module.exports = async(message, id, msg) => {
    switch(id) {
        case "1": {
            // xp
            let guildList = require("../../../../guild.json")
            await ensure(message.author)
            let data = require(`../../../../data/${message.author.id}.json`)
            if (!data.guild.id) return msg.edit({ embed: { color: "#DF8585", description: "> **Tu n'est dans aucune guild, tu ne peux acheter cette article.**" } })
            if (data.money.cash < 10000) return msg.edit({ embed: { color: "#DF8585", description: "> **Tu n'as pas assez d'argent.**" } })
            const index = guildList.findIndex(e => e.id == data.guild.id)
            if (index < 0) return msg.edit({ embed: { color: "#DF8585", description: "> **Je n'ai pas trouver ta guild, contacte les administrateurs.**" } })
            if (guildList[index].bonus.xp >= 1.2) return msg.edit({ embed: { color: "#DF8585", description: "> **Ta guild as atteint le pourcentage maximale de bonus d'xp.**" } })
            guildList[index].bonus.xp += 0.01
            data.guild.buy.push({ date: Date.now(), item: "guildXpBonus"})
            data.money.cash -= 10000
            fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
            fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))
            msg.edit({ embed: { color: "#DF8585", description: `> **Félicitation, les membres de ta guild recevront désormais ${guildList[index].bonus.xp}% d'xp de plus.**` } })
            break;
        };
        case "2": {
            // xp
            let guildList = require("../../../../guild.json")
            await ensure(message.author)
            let data = require(`../../../../data/${message.author.id}.json`)
            if (!data.guild.id) return msg.edit({ embed: { color: "#DF8585", description: "> **Tu n'est dans aucune guild, tu ne peux acheter cette article.**" } })
            if (data.money.cash < 20000) return msg.edit({ embed: { color: "#DF8585", description: "> **Tu n'as pas assez d'argent.**" } })
            const index = guildList.findIndex(e => e.id == data.guild.id)
            if (index < 0) return msg.edit({ embed: { color: "#DF8585", description: "> **Je n'ai pas trouver ta guild, contacte les administrateurs.**" } })
            if (guildList[index].bonus.money >= 1.2) return msg.edit({ embed: { color: "#DF8585", description: "> **Ta guild as atteint le pourcentage maximale de bonus d'argent'.**" } })
            guildList[index].bonus.money += 0.01
            data.guild.buy.push({ date: Date.now(), item: "guildMoneyBonus"})
            data.money.cash -= 20000
            fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
            fs.writeFileSync("guild.json", JSON.stringify(guildList, null, 1))
            msg.edit({ embed: { color: "#DF8585", description: `> **Félicitation, les membres de ta guild recevront désormais ${guildList[index].bonus.money}% d'argent de plus.**` } })
            break;
        };
        case "3": {
            // bague
            await ensure(message.author)
            let data = require(`../../../../data/${message.author.id}.json`)
            if (data.guild.inv.includes("bague")) return msg.edit({ embed: { color: "#DF8585", description: `> **Tu as déjà une bague !**` } })
            if (data.money.cash < 10000) return msg.edit({ embed: { color: "#DF8585", description: `> **Tu n'as pas assez d'argent...**` } })
            if (data.bio.marryID) return msg.edit({ embed: { color: "#DF8585", description: `> **Acheter une bague ne te sert à rien car tu es déjà marié(e) à quelqu'un...**` } })
            data.guild.inv.push("bague")
            data.money.cash -= 10000
            fs.writeFileSync(`data/${message.author.id}.json`, JSON.stringify(data, null, 1))
            msg.edit({ embed: { color: "#DF8585", description: `> **Félicitation, tu as acheter cette magnifique bague avec un diamant pure incrusté, il brille de mille feux !**` } })
            break;
        };
        case "4": {
            // guilde
            break;
        };
        case "5": {
            // casino
            break;
        };
    }
    await deleteCache([`../../../../data/${message.author.id}.json`,"../../../../guild.json"])
}