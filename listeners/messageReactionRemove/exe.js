const rolemenu = require("../rolemenu.json")

module.exports = (react, user) => {
    const msg = react.message
    let rm = rolemenu.find(e => msg.channel.id == e.channel)
    if (!rm || !rm.rm) return
    rm = rm.rm.find(e => e.id == msg.id)
    if (!rm) return
    const e = rm.e.find(e => e.emojis == react.emoji.name)
    if (!e) return
    if (e.action > 0 || e.roles.length <= 0) return false
    e.roles.forEach(e => msg.guild.members.cache.get(user.id).roles.remove(e))
}