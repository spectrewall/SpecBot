module.exports = {
  name: "setrsclockroles",
  category: "moderation",
  description:
    "sets the roles for rsclocktracker at the channel it command was called",
  run: async (client, message, args) => {
    const Discord = require("discord.js");
    const { events } = require("../../config.json");

    if (
      !message.channel.guild
        .member(message.author)
        .hasPermission("ADMINISTRATOR")
    ) {
      message.channel.send("Comando exclusivo para administradores!");
      return;
    }

    let texto = "";
    let descList = [];
    let msgID;

    let embed = new Discord.MessageEmbed()
      .setDescription("")
      .setTimestamp()
      .setColor("1fd14f")
      .setTitle("LOG:");

    msgID = await message.channel.send(embed);

    const roles = await message.channel.guild.roles.fetch();
    events.forEach(async (event) => {
      const role = await roles.cache.find(
        (role) => role.name.toLowerCase() == event.name.toLowerCase()
      );
      console.log(event.name);
      if (role) {
        role
          .edit(
            {
              name: event.name,
              color: event.color,
              mentionable: true,
            },
            "SPECBOT"
          )
          .catch((err) => client.catch(err));

        texto = "";
        texto += "\n";
        texto += event.name;
        texto += ": O cargo já existia e foi editado";
        await descList.push(texto);

        let embed = new Discord.MessageEmbed()
          .setDescription(descList.join(""))
          .setTimestamp()
          .setColor("1fd14f")
          .setTitle("LOG:");

        msgID.edit(embed);
      } else {
        message.channel.guild.roles.create({
          data: {
            name: event.name,
            color: event.color,
            mentionable: true,
          },
        });

        texto = "";
        texto += "\n";
        texto += event.name;
        texto += ": O cargo foi criado";
        await descList.push(texto);

        let embed = new Discord.MessageEmbed()
          .setDescription(descList.join(""))
          .setTimestamp()
          .setColor("1fd14f")
          .setTitle("LOG:");

        msgID.edit(embed);
      }
    });
  },
};
