module.exports = {
  name: "help",
  category: "notModeration",
  description: "Exibe todos os comandos do bot",
  run: async (client, message, args) => {
    const Discord = require("discord.js");
    const { prefix, comandos } = require("../../config.json");
    const mongoose = require("mongoose");

    let GuildPrefix;
    const prefixSearch = mongoose.model("prefixes");
    prefixSearch.findOne(
      { GUILD_ID: message.channel.guild.id },
      async function (err, result) {
        if (err) throw err;
        if (result) {
          //USES CUSTOM PREFIX
          GuildPrefix = await result.PREFIX;
        } else {
          // USES DEFAULT PREFIX
          GuildPrefix = prefix;
        }
      }
    );

    let desc = [];
    let msgID;
    let embed = new Discord.MessageEmbed()
      .setDescription("")
      .setTimestamp()
      .setColor("0a1f29")
      .setTitle("COMANDOS:");

    msgID = await message.channel.send(embed);

    await desc.push(
      "Prefixo para comandos: **" + GuildPrefix + "** ou **@SpecBot**\n\n"
    );

    comandos.forEach(async (comando) => {
      let descricao = "\n";
      descricao += "**";
      descricao += GuildPrefix;
      descricao += comando.name;
      descricao += "**";
      descricao += "\n";
      descricao += comando.desc;
      await desc.push(descricao);

      let embed = new Discord.MessageEmbed()
        .setDescription(desc)
        .setTimestamp()
        .setColor("0a1f29")
        .setTitle("COMANDOS:");

      msgID.edit(embed);
    });
  },
};
