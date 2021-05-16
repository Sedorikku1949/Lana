const { client } = require("../../managers/eventsManagers")
const ytdl = require("ytdl-core-discord")
const { DataResolver } = require("discord.js")

module.exports = async(dispatcher, musique, musicINFO, connection, message) => {
    console.log(client.queue.length > 0)
    return new Promise(async (resolve, reject) => {})
}