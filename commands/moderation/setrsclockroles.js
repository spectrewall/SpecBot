module.exports = {
  name: "setrsclockroles",
  category: "moderation",
  description:
    "sets the roles for rsclocktracker at the channel it command was called",
  run: async (client, message, args) => {
    const Discord = require("discord.js");

    if (
      !message.channel.guild
        .member(message.author)
        .hasPermission("ADMINISTRATOR")
    ) {
      message.channel.send("Comando exclusivo para administradores!");
      return;
    }

    let reply;
  },
};
