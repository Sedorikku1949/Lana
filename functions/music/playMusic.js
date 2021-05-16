const { client } = require("../../managers/eventsManagers");
const addToQueue = require("./addToQueue");
const ytdl = require("ytdl-core-discord")

async function play(prefix, command, message, connection, musicINFO, musique, url) {
  // add to queue if a music play now
  if (client.music.url) return addToQueue( message.content.slice(prefix.length + command.length + 1), message, musicINFO );

  // play musique
  dispatcher = connection.play(musique, { volume: 0.5, type: "opus" });

  client.music = {
    startPlaying: Date.now(),
    url: url,
    volume: 0.5,
    dispatcher: dispatcher,
    info: musicINFO,
  };

  dispatcher.on("start", async () => {
    message.channel.send({
      embed: {
        color: "#2C2F33",
        title: client.music.info.title.slice(0, 253),
        thumbnail: { url: client.music.info.thumbnails.sort((a, b) => b.width - a.width)[0] .url, },
        fields: [
          { name: "Temps :", value: getDuration( Date.now(), Date.now() + Number(client.music.info.lengthSeconds) * 1000, `[mm]:[ss]s` ), inline: true, },
          { name: "Catégory :", value: client.music.info.category, inline: true, },
          { name: "Auteur :", value: `[${client.music.info.author.name}](${client.music.info.author.channel_url}) **[ ${client.music.info.author.subscriber_count} abos ]**`, },
        ],
      },
    });
  });
  
  dispatcher.on("finish", async () => {
    if (client.queue.length > 0) {
        // lancer la prochaine musique
      musique = await ytdl(client.queue[0]).catch(() => false);
      musicINFO = await (await ytdl.getInfo(client.queue[0])).videoDetails;
      url = client.queue[0]
      client.music = {};
      client.queue.splice(0, 1);
      return play(prefix, command, message, connection, musicINFO, musique, url)
    } else {
      // dire que la musique est finie
      client.music = {};
      message.channel.send({ embed: { color: "#2C2F33", description: "> **Je n'ai aucune musique en attente, vous pouvez en remettre une avec la commande =play**" }});
    }
  });
  dispatcher.on("error", (error) => console.log(error));
}

module.exports = play