const { client } = require("../../managers/eventsManagers")

function getAllMessageFromUser(data) {
    let arr = Object.entries(data[1]);
    let i = 0;
    arr.forEach((e) => { i = i + e[1] });
    return i;
}

function filterDates(e) {
    return e.sort((a, b) => {
    const [m1, m2] = [a[0].match(/(\d{2})(\d{2})(\d{4})/).slice(1), b[0].match(/(\d{2})(\d{2})(\d{4})/).slice(1)];
    if (m1[2] < m2[2] || (m1[2] == m2[2] && m1[1] < m2[1]) || (m1[2] == m2[2] && m1[1] == m2[1] && m1[0] < m2[0])) return -1;
  }).map(([date, val]) => ({ date: date.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3"), value: val }) )
};


module.exports = {
    exe: async (message, args, modules, prefix, command) => {
        const analyseTime = Date.now()
        const data = require("../../stats.json")
        const time = getDate(Date.now(), `[DD][MM][YYYY]`)

        let msg = await message.channel.send({embed: { color: "#2c2f33", description: "<a:a_load:826063567258124308> Chargement et traitement des données..."}})

        // création des array
        const UserArrayData = Object.entries(data.user)
        const GlobalArrayData = Object.entries(data.global)
        const ChannelArrayData = Object.entries(data.channel)
        const JoinArrayData = Object.entries(data.join)
        const LeaveArrayData = Object.entries(data.leave)

        // users
        const userMessage = UserArrayData.map(e => ({ id: e[0], i: getAllMessageFromUser(e) }) )
        const topTeenMessage = userMessage.sort((a,b) => b.i - a.i).slice(0,5)
        
        // nouveaux
        const newMembersToday = (data.join[time] + (client.stats.join[time] ? client.stats.join[time] : 0) - (data.leave[time] + (client.stats.leave[time] ? client.stats.leave[time] : 0)))
        const newMembersThisWeek = filterDates(JoinArrayData).slice(0,7).map(e => {
            const index = JoinArrayData.findIndex(a => a[0] == e.date.replace("/", ""))
            if (index < 0) return ({ date: e.date, value: e.value})
            const leave = LeaveArrayData[index]
            const date = e.date
            console.log(date)
            console.log(leave)
            return ({ date: date , value: (e[1] - leave[1]) })
        })

        // global
        const AllMessageThisWeek = filterDates(GlobalArrayData).slice(0,7)
        console.log(AllMessageThisWeek)
        console.log(filterDates(GlobalArrayData))

        msg.edit({ embed: {
            color: "#2C2f33",
            title: "Statistiques du serveur The Last Kingdom Of Eden",
            thumbnail: { url: message.guild.iconURL({ dynamic: true, size: 2048, format: "png" }) },
            fields: [
                {name: "**Messages aujourd'hui :**", value: data.global[time] + client.stats.global[time], inline: false},
                {name: "**Nouveaux aujourd'hui :**", value: newMembersToday, inline: false},
                {name: "**Ton nombre de messages :**", value: data.user[message.author.id][time] + client.stats.user[message.author.id][time], inline: false},
                {name: "**Les 5 utilisateurs les plus actifs :**", value: topTeenMessage.map(e => `**\`${message.guild.members.cache.select(e.id, false, false, false) ? message.guild.members.cache.select(e.id, false, false, false).user.username : e.id}\` > ${e.i}msg**`).join("\n"), inline: false},
                {name: "**Nombres de nouveaux cette semaine :**", value: newMembersThisWeek.map(e => `**\`${e.date}\` > ${e.value}**`).join('\n'), inline: false},
                {name: "**Nombre de messages cette semaine :**", value: AllMessageThisWeek.map(e => `**\`${e.date}\` > ${e.value}**`).join('\n'), inline: false}
            ],
            footer: { text: `Traitement des données en ${(Date.now() - analyseTime) / 1000}s`}
        }})
    },
    config: {
        name: "stats", aliases: [], category: "info", handler: { deleteInvoke: false, staff: false, dev: false, inPogress: false }, help: { desc: "...", use: "..." }, modules: []
    }
}