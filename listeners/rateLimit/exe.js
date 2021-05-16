const { client } = require("../../managers/eventsManagers")

module.exports = async(rateLimitInfo) => {
    client.channels.cache.get("834112549691326524").send({ embed: {
        author: {name: "RateLimit"},
        color: "#2C2F33",
        title: rateLimitInfo.method ? rateLimitInfo.method : "...",
        description: "```js\n" + require("util").inspect(rateLimitInfo) + "```",
        fields: [
            { name: "**MsDate :**", value: "`" +Date.now()  + "`", inline: true },
            { name: "**Limit :**", value: "`" + (rateLimitInfo.limit ? rateLimitInfo.limit : "..." )  + "`", inline: false },
            { name: "**Path :**", value: "`" + (rateLimitInfo.path ? rateLimitInfo.path : "...")  + "`", inline: false },
            { name: "**Route :**", value: "`" + (rateLimitInfo.route ? rateLimitInfo.route : "...")  + "`", inline: false },
            { name: "**Timeout :**", value: "`" + `${rateLimitInfo.timeout ? `${rateLimitInfo.timeout} ( ${getDuration(Date.now(), (Date.now() + rateLimitInfo.timeout), "[ss]s")} )` : "..."}`  + "`", inline: false }
        ]
    }})
}
