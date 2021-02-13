module.exports = {
  name: "play",
  category: "notModeration",
  description: "plays a music",
  aliases: ["p"],
  run: async (client, message, args) => {
    const { errorSend } = require("../../utils");

    //Permission check
    if (!message.member.voice.channel)
      return message.channel.send(
        "Você precisa estar em um canal de voz para usar este comando."
      );

    //Spotify check
    if (args.join(" ").search("spotify") > -1) {
      return message.channel.send("Spotify **não** suportado ainda.");
    }

    const music = args.join(" ");

    //Play
    try {
      client.distube.play(message, music);
    } catch (err) {
      errorSend(client, err, "ERRO NO COMANDO PLAY - 1 EXECUÇÃO");
      console.log("\nTentando segunda execução...");
      try {
        client.distube.play(message, music);
      } catch (err) {
        errorSend(client, err, "2 EXECUÇÃO", true, message);
      }
    }
  },
};
