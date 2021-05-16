const matrice = { "0": { "0": false, "1": false, "2": false, "3": false, "4": false, "5": false, "6": false }, "1": { "0": false, "1": false, "2": false, "3": false, "4": false, "5": false, "6": false }, "2": { "0": false, "1": false, "2": false, "3": false, "4": false, "5": false, "6": false }, "3": { "0": false, "1": false, "2": false, "3": false, "4": false, "5": false, "6": false }, "4": { "0": false, "1": false, "2": false, "3": false, "4": false, "5": false, "6": false }, "5": { "0": false, "1": false, "2": false, "3": false, "4": false, "5": false, "6": false }, "6": { "0": false, "1": false, "2": false, "3": false, "4": false, "5": false, "6": false } }

async function startGame(first, second, msg) {
    return new Promise((resolve, reject) => {
        ["✅", "❌"].forEach(async(e) => await msg.react(e))
        let start = 7
        const filter = (react, user) => ["✅", "❌"].includes(react.emoji.name) && user.id == second.id
        const collector = msg.createReactionCollector(filter, { time: 60000 })
        collector.on("collect", (react) => {
            switch (react.emoji.name) {
                case "✅": {
                    start = true
                    collector.stop()
                }
                case "❌": {
                    start = false
                    collector.stop()
                }
            }
        })
        collector.on("end", () => {
            if (!start) {
                msg.reactions.removeAll()
                msg.edit(`> **Désolé mais <@${second.id}> ne veux pas jouer**`)
                resolve(false)
            } else if (start == 7) {
                msg.reactions.removeAll()
                msg.edit(`> **Désolé mais <@${second.id}> as mis trop de temps à répondre**`)
                resolve(false)
            } 
            else {
                msg.reactions.removeAll()
                msg.edit("> **Je charge tout les éléments necessaires à la partie...**")
                resolve(true)
            }
        })
    })
}

function modifyTbl(tbl, tour, colonne) {

    // ducoup c'est tbl["0"]["4"] pour avoir la colonne 4 de la rangé 0
        //ducoup je peux faire tbl["0"]["4"] = player?
    let player = false
    if (tour !== 0) player = tour % 2 == 0 ? 1 : 2

    // j'éteint mon pc là
    // sorry je peux vraiement plus
    //je peux tester sur le rar que tu m'a donné? ok


    console.log(player)
    /*
    if (!t["0"]) t["0"] = player
    else if (!t["1"]) t["1"] = player
    else if (!t["2"]) t["2"] = player
    else if (!t["3"]) t["3"] = player
    else if (!t["4"]) t["4"] = player
    else if (!t["5"]) t["5"] = player
    else t["6"] = player
    return t*/

    // on recommence :')

}

async function game(first, second, msg, tbl, tour) {
    return new Promise(async(resolve, reject) => {
        await msg.react("0️⃣"); await msg.react("1️⃣"); await msg.react("2️⃣"); await msg.react("3️⃣"); await msg.react("4️⃣"); await msg.react("5️⃣"); await msg.react("6️⃣")
        const filter = (react, user) => ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"].includes(react.emoji.name) && user.id == (tour % 2 == 0 ? first.id : second.id) && !user.bot
        const collector = msg.createReactionCollector(filter, { time: 60000 })
        collector.on('collect', (react, user) => {
            switch (react.emoji.name) {
                case "0️⃣": { console.log(0) } break;
                case "1️⃣": { console.log(1) } break;
                case "2️⃣": { console.log(2) } break;
                case "3️⃣": { console.log(3) } break;
                case "4️⃣": { console.log(4) } break;
                case "5️⃣": { console.log(5) } break;
                case "6️⃣": { console.log(6) } break;
            }
        })
        collector.on("end", () => {})
    })
}

function seeTbl(tbl, first, second, tour) {
    var tb = []
    tbl.forEach((e) => {
        const t = []
        Object.entries(e.a).map(e => e[1]).forEach((a) => {
            if (a == 1) {
                t.push("🔵") // first user
            } else if (a == 2) {
                t.push("🔴") // second user
            } else t.push("⚪") // case non remplie
        })
        tb.push(t.join(""))
    })
    return { embed: { color: "#85F492", title: "Puissance 4", description:  tb.join("\n"), fields: [{ name: '\u200b', value: `<@${first.id}> ${tour % 2 == 0 ? "**à toi de jouer**" : ""} \n <@${second.id}> ${tour % 2 == 0 ? "" : "**à toi de jouer**"}`}] }}
}

/*
 
 first = l'auteur du message
 second = le deuxième joueur

 */


const player = {}

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        // lancement de la partie
        if (player[message.author.id]) return message.channel.send("> **Tu est déjà en jeux, termine ta partie pour en lancer une autre**")
        if (!args[0]) return message.channel.send("> **Je ne sais pas avec qui tu veux jouer**")
        const second = message.guild.members.cache.select(args[0], false, false)
        if (!second) return message.channel.send("🔎 **Je n'ai pas trouvé la personne avec qui tu veux joué, réessaye avec d'autres arguments**")
        if (player[second.id]) return message.channel.send(`> **\`${second.displayName}\` est déjà en jeux, il/elle devras terminer sa partie pour jouer avec toi**`)
        let msg = await message.channel.send(`> <@${second.id}>**, veux tu jouer avec <@${message.author.id}> au puissance 4 ?**`)
        const start = await startGame(message.member, second, msg)
        if (!start) return console.log("game annulé")

        // création des ressources necessaires 
        player[message.member.id] = true
        player[second.id] = true
        let tbl = Object.entries(matrice).map(e => ({ i: e[0], a: e[1] }))
        let win = false
        let end = false
        console.log(matrice)
        await msg.edit(seeTbl(tbl, message.member, second, 0))

        for (let i = 1; i < 100; i++) {
            const a = await game(message.member, second, msg, tbl, i)
            console.log(a)
        }
  },
    config: {
        name: "puissance", aliases: [], category: "game", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: true }, help: { desc: "beaucoup trop de lignes pour une commande bugué...", use: "heu, comment on l'utilise ?" }, modules: []
    }
};