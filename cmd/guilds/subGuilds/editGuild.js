const fs = require("fs")

module.exports = async(message, question, guild, guildList) => {
    await question.edit({ embed: { color: "#2C2F33", description: `**Que veux tu modifier sur la guild ${guild.name} ?** \`\`\`\nname\ndescription\nserver\nicon\nbanner\npgm\nresponsable\`\`\`` } })
    const filter = (m, user) => ["name", "description", "server", "icon", "banner", "pgm", "responsable", "cancel"].includes(m.content.toLowerCase())
    const collector = message.channel.createMessageCollector(filter, { time: 60000 })
    
    collector.on("collect", async(msg) => {
        if (msg.author.id !== message.author.id) return
        if (msg.content == "cancel") {
            await msg.react("✅")
            collector.stop()
        }
        switch(msg.content.toLowerCase()) {
            case "name": { require("./guildEdit/name")(message, guild, guildList, question); msg.delete(); collector.stop(); break; }
            case "description": { require("./guildEdit/desc")(message, guild, guildList, question); msg.delete(); collector.stop(); break; }
            case "server": { require("./guildEdit/server")(message, guild, guildList, question); msg.delete(); collector.stop(); break; }
            case "icon": { require("./guildEdit/icon")(message, guild, guildList, question); collector.stop(); break; }
            case "banner": { require("./guildEdit/banner")(message, guild, guildList, question); msg.delete(); collector.stop(); break; }
            case "pgm": { require("./guildEdit/pgm")(message, guild, guildList, question); collector.stop(); msg.delete(); break; }
            case "responsable": { require("./guildEdit/responsable")(message, guild, guildList, question); msg.delete(); collector.stop(); break; }
        }
    })

    collector.on("end", () => false)
}