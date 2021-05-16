const rolemenu = require("../rolemenu.json")
const ticket = require("../../functions/app/ticket")

module.exports = (react, user) => {
    const msg = react.message
    let rm = rolemenu.find(e => msg.channel.id == e.channel)
    if (!rm || !rm.rm) return
    rm = rm.rm.find(e => e.id == msg.id)
    if (!rm) return 
    const e = rm.e.find(e => e.emojis == react.emoji.name)
    if (!e) return 
    if (msg.id == "800387122548441108" && react.emoji.name == "✉️") ticket(msg, user, react)
    if (e.action > 0 || e.roles.length <= 0) return 
    e.roles.forEach(b => msg.guild.members.cache.get(user.id).roles.add(b).catch(() => 0))
}

 