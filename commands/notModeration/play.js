module.exports = {
  name: "play",
  category: "notModeration",
  description: "plays a music",
  aliases: ["p"],
  run: async (client, message, args) => {
    if (!message.member.voice.channel)
      return message.channel.send(
        "Você precisa estar em um canal de voz para usar este comando."
      );

    const music = args.join(" ");

    client.distube.play(message, music);
  },
};
