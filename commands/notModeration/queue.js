module.exports = {
  name: "queue",
  category: "notModeration",
  description: "Manda no chat a fila de músicas",
  aliases: ["s"],
  run: async (client, message, args) => {
    const Discord = require("discord.js");
    let queue = await client.distube.getQueue(message);
    let msgID;
    let desc = [];
    let tittle = [];
    let i = true;
    let index = 0;
    let timeLeft;
    let texto;

    function msToTime(s) {
      // Pad to 2 or 3 digits, default is 2
      function pad(n, z) {
        z = z || 2;
        return ("00" + n).slice(-z);
      }

      var ms = s % 1000;
      s = (s - ms) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;
      var hrs = (s - mins) / 60;

      if (hrs == 0) {
        return pad(mins) + ":" + pad(secs) + "." + pad(ms, 3);
      } else {
        return pad(hrs) + ":" + pad(mins) + ":" + pad(secs) + "." + pad(ms, 3);
      }
    }

    timeLeft = msToTime(queue.songs[0].duration * 1000 - queue.currentTime);
    texto = `**Tocando Agora**\n[${queue.songs[0].name}](${queue.songs[0].url}) - \`${timeLeft}\` restantes`;
    tittle.push(texto);
    console.log(texto);
    desc.push(
      queue.songs
        .map((song, id) => {
          if (id >= 1) {
            `**${id + 1}**. [${song.name}](${song.url}) - \`${
              song.formattedDuration
            }\``;
          }
        })
        .join("\n")
    );

    async function messageTimer() {
      i = false;
    }

    let embed = new Discord.MessageEmbed()
      .setDescription(desc.slice(index, index + 14))
      .setTimestamp()
      .setColor("0a1f29")
      .setTitle("Fila Atual:");

    msgID = await message.channel.send(embed);
    setTimeout(messageTimer, 60000);

    /*while (i) {
      let embed = new Discord.MessageEmbed()
        .setDescription(desc.slice(index, index + 14))
        .setTimestamp()
        .setColor("0a1f29")
        .setTitle("Fila Atual:");

      msgID = await message.channel.send(embed);
    }*/
  },
};
