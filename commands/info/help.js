module.exports = {
  name: "help",
  category: "moderation",
  description: "creditos as pessoas responsaveis pelo bot",
  run: async (client, message, args) => {
    const Discord = require("discord.js");
    const { comandos } = require("../../config.json");

    let prefix = "!";
    let desc = [];
    let msgID;
    let embed = new Discord.MessageEmbed()
      .setDescription("")
      .setTimestamp()
      .setColor("1fd14f")
      .setTitle("COMANDOS:");

    msgID = await message.channel.send(embed);

    comandos.forEach(async (comando) => {
      let descricao = "\n";
      descricao += prefix;
      descricao += comando.name;
      descricao += "\n";
      descricao += comando.desc;
      await desc.push(descricao);

      let embed = new Discord.MessageEmbed()
        .setDescription(desc)
        .setTimestamp()
        .setColor("1fd14f")
        .setTitle("COMANDOS:");

      msgID.edit(embed);
      console.log(descricao);
    });
  },
};
