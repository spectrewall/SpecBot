module.exports = {
  name: "prefix",
  category: "moderation",
  description: "changes the server commands prefix",
  run: async (client, message, args) => {
    const Discord = require("discord.js");
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

    //Args check for this commands an arg is necessary, and i limited it to 1 - 3 length prefix
    if (!args[0]) {
      message.channel.send(
        "Para esse comando é necessário um argumento Ex: @SpecBot Prefix Novo_Prefixo"
      );
      return;
    }
    if (args[0].length <= 0 || args[0].length > 3) {
      message.channel.send(
        "O Prefixo precisa ser de no minimo 1 caráctere e no máximo 3 carácteres"
      );
      return;
    }

    //Prefix command
    try {
      let reply;
      const novaGuild = mongoose.model("prefixes");
      new novaGuild({
        GUILD_ID: message.channel.guild.id,
        PREFIX: args[0],
      })
        .save()
        .then(() => {
          console.log(
            `PrefixGuild ${message.channel.guild.name} ID: ${message.channel.guild.id} cadastrada com sucesso`
          );
          reply = `Prefixo dos comandos trocado para: ${args[0]}`;
          message.channel.send(reply);
        })
        .catch(async (err) => {
          novaGuild
            .findOneAndUpdate(
              { GUILD_ID: message.channel.guild.id },
              { PREFIX: args[0] }
            )
            .then(() => {
              console.log(
                `PrefixGuild ${message.channel.guild.name} ID: ${message.channel.guild.id} cadastrada com sucesso`
              );
              reply = `Prefixo dos comandos trocado para: ${args[0]}`;
              message.channel.send(reply);
            });
        });
    } catch (err) {
      errorSend(client, err, "ERRO NO COMANDO PREFIX", true, message);
    }
  },
};
