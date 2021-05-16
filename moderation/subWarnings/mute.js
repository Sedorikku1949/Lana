// move = ["i", "d"]
// i = increase  = + 1
// d = decrease = - 1

function page(x, embed, move) {
    if (move == "d") {
        if (x <= 0) return embed.length
        else return x - 1
    } else {
        if (x >= embed.length) return 0
        else return x + 1
    }
}

module.exports = async(message, data) => {
    if (data.sanctions.mute <= 0) return message.channel.send({ embed: { color: '#FF6565', title: "Cette utilisateur n'a jamais été mute"}})
    let [x, embed] = [ 0 , data.sanctions.mute.map((e, index) => ({
        color: '#FF6565',
        title: `[ ${index + 1} ] ${data.id}`,
        footer: {text: e.id},
        fields: [
            { name: "**Modérateur :**", value: `<@${e.mod}>`, inline: true},
            { name: "**Raison :**", value: e.reason, inline: true},
            { name: "**Date :**", value: getDate(Number(e.date), `[DD]/[MM]/[YYYY] à [hh]:[mm] et [ss]s`), inline: true},
            { name: "**Temps :**", value: getDuration(Date.now(), Date.now() + e.time, "[hh]h et [mm]m"), inline: true},
            { name: "**Demute :**", value: e.unmute}
        ]
    }))]
    const msg = await message.channel.send({embed: embed[x]})
    if (data.sanctions.mute.length > 1) {
        await msg.react("◀️")
        await msg.react("▶️")
        await msg.react("🗑️")
    }
    const filter = (react, user) => ["◀️", "▶️", "🗑️"].includes(react.emoji.name) && user.id === message.author.id;
    const collector = msg.createReactionCollector(filter, { time: 60000 });
    collector.on('collect', async(react) => {
        switch(react.emoji.name) {
            case "◀️": { x = page(x, embed, "d") ; await msg.edit({embed: embed[x]}) ; react.users.remove(message.author.id) ; break }
            case "▶️": { x = page(x, embed, "i") ;  await msg.edit({embed: embed[x]}) ; react.users.remove(message.author.id) ; break }
            case "🗑️": collector.stop()
        }
    });
    collector.on('end', () => {});
}
