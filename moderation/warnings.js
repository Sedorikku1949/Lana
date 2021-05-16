const ban = require("./subWarnings/ban")
const kick = require("./subWarnings/kick")
const mute = require("./subWarnings/mute")
const warn = require("./subWarnings/warn")
const note = require("./subWarnings/note")
const resume = require("./subWarnings/resume")

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
      if(!args[0]) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je n'ai pas trouver cette personne ou tu n'a pas dit qui je doit afficher**" } })
      const user = await message.guild.members.cache.select(args[0], true, false, true)
      try { data = require(`../../data/${user ? user.id : args[0]}.json`) } catch (error) { data = false }
      if (!data) return message.channel.send({ embed: { color: "#ED4245", description: "> **Je n'ai pas trouver cette personne**" } })
      const mesg = await message.channel.send({embed: {
        color: '#FF6565',
        title: "Quel sanction veut tu voir ?",
        description: `\`\`\`\nresume\nban  (${data.sanctions.ban.length})\nkick (${data.sanctions.kick.length})\nmute (${data.sanctions.mute.length})\nwarn (${data.sanctions.warn.length})\nnote (${data.sanctions.notes.length})\n\`\`\``,
        footer: { text: user.user ? user.user.tag : user.tag}
      }})
      const filter = (m, user) => ["mute", "note", "kick", "ban", "mute", "warn", "resume"].includes(m.content.toLowerCase())
      const collector = message.channel.createMessageCollector(filter, {time: 60000})
      collector.on("collect", async(msg) => {
          if (msg.author.id !== message.author.id) return
          switch(msg.content.toLowerCase()) {
              case "ban": return ban(message, data) && await msg.delete() && await mesg.delete() && collector.stop()
              case "kick": return kick(message, data) && await msg.delete() && await mesg.delete() && collector.stop()
              case "mute": return mute(message, data) && await msg.delete() && await mesg.delete() && collector.stop()
              case "warn": return warn(message, data) && await msg.delete() && await mesg.delete() && collector.stop()
              case "note": return note(message, data) && await msg.delete() && await mesg.delete() && collector.stop()
              case "resume": return resume(message, data) && await msg.delete() && await mesg.delete() && collector.stop()
          }
      })
      collector.on("end", () => false)
  },
    config: {
        name: "warnings", aliases: ["avertissement", "sanctions", "ptdrtki"], category: "moderation", handler: { deleteInvoke: false, staff: true, dev: false, inPogress: false }, help: { desc: "Affiche toutes les sanctions de quelqu'un", use: "=warnings <user>" }, modules: []
    }
};