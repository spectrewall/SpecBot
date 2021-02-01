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
    let page;
    let totalPages;

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
        return pad(mins) + ":" + pad(secs);
      } else {
        return pad(hrs) + ":" + pad(mins) + ":" + pad(secs);
      }
    }

    timeLeft = msToTime(queue.songs[0].duration * 1000 - queue.currentTime);
    texto = `**Tocando Agora**\n[${queue.songs[0].name}](${queue.songs[0].url}) - \`${timeLeft}\` restantes`;
    tittle.push(texto);
    tittle.push("\n\n**Próximas**\n");

    queue.songs.map(async (song, id) => {
      if (id >= 1) {
        if (song.name.length >= 50)
          desc.push(
            `**${id}**. [${song.name.slice(0, 49)}...](${song.url}) - \`${
              song.formattedDuration
            }\``
          );
        else
          desc.push(
            `**${id}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``
          );
      }
    });

    async function messageTimer() {
      i = false;
    }
    setTimeout(messageTimer, 120000);

    if (desc.length <= 15) {
      let embed = new Discord.MessageEmbed()
        .setDescription(tittle + desc.join("\n"))
        .setTimestamp()
        .setColor("0a1f29")
        .setTitle("Fila Atual:");

      msgID = await message.channel.send(embed);
    } else {
      totalPages = Math.ceil(desc.length / 15);
      page = 1;

      let embed = new Discord.MessageEmbed()
        .setDescription(tittle + desc.slice(index, index + 14).join("\n"))
        .setTimestamp()
        .setColor("0a1f29")
        .setFooter(`Página ${page}/${totalPages}`)
        .setTitle("Fila Atual:");

      msgID = await message.channel.send(embed);
      await msgID.react("⬅");
      await msgID.react("➡");
      client.on("messageReactionAdd", async (reaction, user) => {
        //Back arrow
        if (
          reaction.emoji.name === "⬅" &&
          !user.bot &&
          reaction.message === msgID
        ) {
          if (page > 1) {
            index -= 15;
            page -= 1;

            tittle = [];
            timeLeft = msToTime(
              queue.songs[0].duration * 1000 - queue.currentTime
            );
            texto = `**Tocando Agora**\n[${queue.songs[0].name}](${queue.songs[0].url}) - \`${timeLeft}\` restantes`;
            tittle.push(texto);
            tittle.push("\n\n**Próximas**\n");

            let embed = new Discord.MessageEmbed()
              .setDescription(tittle + desc.slice(index, index + 15).join("\n"))
              .setTimestamp()
              .setColor("0a1f29")
              .setFooter(`Página ${page}/${totalPages}`)
              .setTitle("Fila Atual:");

            msgID.edit(embed);
          } else {
            index = (totalPages - 1) * 15;
            page = totalPages;

            tittle = [];
            timeLeft = msToTime(
              queue.songs[0].duration * 1000 - queue.currentTime
            );
            texto = `**Tocando Agora**\n[${queue.songs[0].name}](${queue.songs[0].url}) - \`${timeLeft}\` restantes`;
            tittle.push(texto);
            tittle.push("\n\n**Próximas**\n");

            let embed = new Discord.MessageEmbed()
              .setDescription(tittle + desc.slice(index, index + 15).join("\n"))
              .setTimestamp()
              .setColor("0a1f29")
              .setFooter(`Página ${page}/${totalPages}`)
              .setTitle("Fila Atual:");

            msgID.edit(embed);
          }
          msgID.reactions.cache
            .find((item) => item._emoji.name === "⬅")
            .users.remove(user);
        }
        //Ahead Arrow
        if (
          reaction.emoji.name === "➡" &&
          !user.bot &&
          reaction.message === msgID
        ) {
          if (page < totalPages) {
            index += 15;
            page += 1;

            tittle = [];
            timeLeft = msToTime(
              queue.songs[0].duration * 1000 - queue.currentTime
            );
            texto = `**Tocando Agora**\n[${queue.songs[0].name}](${queue.songs[0].url}) - \`${timeLeft}\` restantes`;
            tittle.push(texto);
            tittle.push("\n\n**Próximas**\n");

            let embed = new Discord.MessageEmbed()
              .setDescription(tittle + desc.slice(index, index + 15).join("\n"))
              .setTimestamp()
              .setColor("0a1f29")
              .setFooter(`Página ${page}/${totalPages}`)
              .setTitle("Fila Atual:");

            msgID.edit(embed);
          } else {
            index = 0;
            page = 1;

            tittle = [];
            timeLeft = msToTime(
              queue.songs[0].duration * 1000 - queue.currentTime
            );
            texto = `**Tocando Agora**\n[${queue.songs[0].name}](${queue.songs[0].url}) - \`${timeLeft}\` restantes`;
            tittle.push(texto);
            tittle.push("\n\n**Próximas**\n");

            let embed = new Discord.MessageEmbed()
              .setDescription(tittle + desc.slice(index, index + 15).join("\n"))
              .setTimestamp()
              .setColor("0a1f29")
              .setFooter(`Página ${page}/${totalPages}`)
              .setTitle("Fila Atual:");

            msgID.edit(embed);
          }
          msgID.reactions.cache
            .find((item) => item._emoji.name === "➡")
            .users.remove(user);
        }
      });
    }
  },
};
