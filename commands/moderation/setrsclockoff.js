module.exports = {
  name: "setrsclockoff",
  category: "moderation",
  description: "sets off rsclocktracker at the channel it command was called",
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
    const RegisteredGuild = mongoose.model("guilds");
    RegisteredGuild.findOneAndDelete(
      { GUILD_ID: message.channel.guild.id },
      function (err, obj) {
        console.log(obj);
        reply = "Esse canal não receberá mais atualizações do RSClockTracker";
        message.channel.send(reply);
      }
    );
  },
};
