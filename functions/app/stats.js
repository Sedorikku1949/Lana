const { client } = require("../../managers/eventsManagers")

module.exports = async(message) => {
    // global stats
    if (!client.stats.global[getDate(Date.now(), "[DD][MM][YYYY]")]) client.stats.global[getDate(Date.now(), "[DD][MM][YYYY]")] = 0
    client.stats.global[getDate(Date.now(), "[DD][MM][YYYY]")] = client.stats.global[getDate(Date.now(), "[DD][MM][YYYY]")] + 1
    // user stats
    if (!client.stats.user[message.author.id]) client.stats.user[message.author.id] = {}
    if (!client.stats.user[message.author.id][getDate(Date.now(), "[DD][MM][YYYY]")]) client.stats.user[message.author.id][getDate(Date.now(), "[DD][MM][YYYY]")] = 0
    client.stats.user[message.author.id][getDate(Date.now(), "[DD][MM][YYYY]")] = client.stats.user[message.author.id][getDate(Date.now(), "[DD][MM][YYYY]")] + 1
    // channel stats
    if (!client.stats.channel[message.channel.id]) client.stats.channel[message.channel.id] = {}
    if (!client.stats.channel[message.channel.id][getDate(Date.now(), "[DD][MM][YYYY]")]) client.stats.channel[message.channel.id][getDate(Date.now(), "[DD][MM][YYYY]")] = 0
    client.stats.channel[message.channel.id][getDate(Date.now(), "[DD][MM][YYYY]")] = client.stats.channel[message.channel.id][getDate(Date.now(), "[DD][MM][YYYY]")] + 1
}