module.exports = {
  name: "setrsclock",
  category: "moderation",
  description: "sets rsclocktracker at the channel it command was called",
  run: async (client, message, args) => {
    const mongoose = require("mongoose");
    const { errorSend } = require("../../utils");

    //Permission check
    if (
      !message.channel.guild
        .member(message.author)
        .hasPermission("ADMINISTRATOR")
    ) {
      message.channel.send("Comando exclusivo para administradores!");
      return;
    }

    //setrsclock command
    const novaGuild = mongoose.model("guilds");

    new novaGuild({
      GUILD_ID: message.channel.guild.id,
      CHANNEL_ID: message.channel.id,
    })
      .save()
      .then(() => {
        console.log(
          `Guild ${message.channel.guild.name} ID: ${message.channel.guild.id} cadastrada no mongo com sucesso`
        );
        message.channel.send(
          "Esse canal agora irá receber atualizações do RSClockTracker!"
        );
      })
      .catch(async (err) => {
        console.log(
          "Houve um erro ao registrar a guild ${message.channel.guild.name} ID: ${message.channel.guild.id}: " +
            err
        );
        novaGuild.findOne(
          { GUILD_ID: message.channel.guild.id },
          async function (err, obj) {
            message.channel.send(
              "Apenas um canal permitido por servidor!\nAtivo agora no canal: " +
                message.guild.channels.cache.get(obj.CHANNEL_ID).toString()
            );
            errorSend(client, err, "ERRO NO SETRSCLOCK.", true, message);
          }
        );
      });
  },
};
