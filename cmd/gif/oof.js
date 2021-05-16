const gif = [
    "https://media.discordapp.net/attachments/782235571094945792/836580315366817833/image0.png",
    "https://media.discordapp.net/attachments/782235571094945793/836579615588745286/image0.jpg",
    "https://media.tenor.com/images/c3bf8615d6cfd311a1ab4b85f7368c7c/tenor.png",
    "https://images.squarespace-cdn.com/content/v1/5a01e930e5dd5bc02c923380/1570912435014-WSF9RMIHXBX3ZBGS4TRJ/ke17ZwdGBToddI8pDm48kDNJq2DPk-Wo2aps4Q9cDVl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0mwD1g8DYbkhCsgrhnj8CXYdHOTtwMaXOCFEvZOc4sRX6NsU27u2nfjJc-6lTDGhKg/4++Stones+2004+-+Shadow+Gang.jpg",
    "https://i.kym-cdn.com/photos/images/newsfeed/001/730/535/01e.jpg",
]

module.exports = {
    exe: async (message, args, modules, prefix, command) => {
    message.channel.send({embed: {color: "#707070", description: "OOF", image: {url: gif[Math.floor(Math.random()  * gif.length)] }, footer: { text: "utiliser par " + message.author.tag} }})
  },
    config: {
        name: "oof", aliases: ["caillou"], category: "gif", handler: { deleteInvoke: true, staff: false, dev: false, inPogress: false }, help: { desc: "OOF", use: "Aucun argument requis" }, modules: []
    }
};
