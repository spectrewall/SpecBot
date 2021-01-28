module.exports = {
  name: "creditos",
  category: "moderation",
  description: "creditos as pessoas responsaveis pelo bot",
  run: async (client, message, args) => {
    const Discord = require("discord.js");

    let embed = new Discord.MessageEmbed()
      .setTitle("CREDITOS")
      .setDescription(
        "PVT " +
          variaveis.horamarcada +
          "\n\nClique no 👍 para confirmar\nsua participação. \n\n **Jogadores Confirmados:**\n"
      )
      .setTimestamp()
      .setColor("d11f1f");

    let msgID;
    reply.channel.send(embed).then((embedMessage) => {
      embedMessage.react("👍").then((embedMessage) => {
        msgID = embedMessage.message;
      });
    });
  },
};
