module.exports = {
  name: "setrsclock",
  category: "moderation",
  description: "sets rsclocktracker at the channel it command was called",
  run: async (client, message, args) => {
    const Discord = require("discord.js");
    const mongoose = require("mongoose");

    if (
      !message.channel.guild
        .member(message.author)
        .hasPermission("ADMINISTRATOR")
    ) {
      message.channel.send("Comando exclusivo para administradores!");
      return;
    }

    let reply;
    const novaGuild = mongoose.model("guilds");

    new novaGuild({
      GUILD_ID: message.channel.guild.id,
      CHANNEL_ID: message.channel.id,
    })
      .save()
      .then(() => {
        console.log(
          `Guild ${message.channel.guild.name} ID: ${message.channel.guild.id} cadastrada com sucesso`
        );
        reply = "Esse canal agora irá receber atualizações do RSClockTracker!";
        message.channel.send(reply);
      })
      .catch(async (err) => {
        console.log(
          "Houve um erro ao registrar a guild ${message.channel.guild.name} ID: ${message.channel.guild.id}: " +
            err
        );
        novaGuild.findOne(
          { GUILD_ID: message.channel.guild.id },
          async function (err, obj) {
            reply =
              "Apenas um canal permitido por servidor!\nAtivo agora no canal: " +
              message.guild.channels.cache.get(obj.CHANNEL_ID).toString();
            message.channel.send(reply);
          }
        );
      });
  },
};
