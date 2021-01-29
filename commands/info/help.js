module.exports = {
  name: "help",
  category: "moderation",
  description: "creditos as pessoas responsaveis pelo bot",
  run: async (client, message, args) => {
    const Discord = require("discord.js");
    const { comandos } = require("../../config.json");

    let msgID;
    let embed = new Discord.MessageEmbed()
      .setDescription("")
      .setTimestamp()
      .setColor("1fd14f")
      .setTitle("LOG:");

    msgID = await message.channel.send(embed);
  },
};
