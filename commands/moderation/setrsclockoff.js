module.exports = {
  name: "setrsclockoff",
  category: "moderation",
  description: "sets off rsclocktracker at the channel it command was called",
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

    //setrsclockoff command
    try {
      let reply;
      const RegisteredGuild = mongoose.model("guilds");
      RegisteredGuild.findOneAndDelete(
        { GUILD_ID: message.channel.guild.id },
        function (err, obj) {
          console.log(
            `Guild ${message.channel.guild.name} ID: ${message.channel.guild.id} removida do mongo com sucesso`
          );
          reply = "Esse canal não receberá mais atualizações do RSClockTracker";
          message.channel.send(reply);
        }
      );
    } catch (err) {
      errorSend(client, err, "ERRO NO SETCLOCKOFF", true, message);
    }
  },
};
