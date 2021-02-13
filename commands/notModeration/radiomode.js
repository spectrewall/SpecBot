module.exports = {
  name: "radiomode",
  category: "notModeration",
  description: "toggle radio mode (on/off)",
  aliases: ["r"],
  run: async (client, message, args) => {
    const { errorSend } = require("../../utils");

    //Permission check
    if (!message.member.voice.channel)
      return message.channel.send(
        "Você precisa estar em um canal de voz para usar este comando."
      );

    //Arg check - if there is any args the bot will play it
    if (args[0]) {
      if (args.join(" ").search("spotify") > -1) {
        return message.channel.send("Spotify **não** suportado ainda.");
      }
      const music = args.join(" ");
      try {
        await client.distube.play(message, music);
      } catch (err) {
        errorSend(client, err, "ERRO NO COMANDO RADIOMODE", true, message);
      }
    }

    //toggle Radiomode
    try {
      let queue = await client.distube.getQueue(message);
      if (queue) {
        let mode = await client.distube.toggleAutoplay(message);
        await message.channel.send(
          "O **Modo Rádio** agora está: `" +
            (mode ? "Ligado" : "Desligado") +
            "`"
        );
      } else {
        await message.channel.send(
          'A fila precisa ter pelo menos uma música. Utilize antes o comando "**PLAY** nome-da-música" para adicionar uma música, ou utilize "**RADIOMODE** nome-da-música".'
        );
      }
    } catch (err) {
      errorSend(client, err, "ERRO NO COMANDO RADIOMODE", true, message);
    }
  },
};
