module.exports = {
  name: "resume",
  category: "notModeration",
  description: "pausa a música",
  aliases: ["r"],
  run: async (client, message, args) => {
    if (!message.member.voice.channel)
      return message.channel.send(
        "Você precisa estar em um canal de voz para usar este comando."
      );

    let queue = await client.distube.getQueue(message);

    if (queue) {
      client.distube.pause(message);

      message.react("✅");
    } else if (!queue) {
      return;
    }
  },
};
