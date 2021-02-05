module.exports = {
  name: "radiomode",
  category: "notModeration",
  description: "toggle radio mode (on/off)",
  aliases: ["r"],
  run: async (client, message, args) => {
    if (!message.member.voice.channel)
      return message.channel.send(
        "Você precisa estar em um canal de voz para usar este comando."
      );
    if (args[0]) {
      if (args.join(" ").search("spotify") > -1) {
        return message.channel.send("Spotify **não** suportado ainda.");
      }
      const music = args.join(" ");
      await client.distube.play(message, music);
    }

    try {
      let mode = await client.distube.toggleAutoplay(message);
      await message.channel.send(
        "O **Modo Rádio** agora está: `" + (mode ? "Ligado" : "Desligado") + "`"
      );
    } catch (err) {
      console.log(err);
      await message.channel.send(
        'A fila precisa ter pelo menos uma música. Utilize antes o comando "**PLAY** nome-da-música" para adicionar uma música, ou utilize "**RADIOMODE** nome-da-música".'
      );
    }
  },
};
