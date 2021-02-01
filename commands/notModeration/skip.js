module.exports = {
  name: "skip",
  category: "notModeration",
  description: "Pula para a proxima música da fila",
  aliases: ["s"],
  run: async (client, message, args) => {
    if (!message.member.voice.channel)
      return message.channel.send(
        "Você precisa estar em um canal de voz para usar este comando."
      );

    let queue = await client.distube.getQueue(message);

    if (queue) {
      client.distube.skip(message);

      message.react("✅");
    } else if (!queue) {
      return;
    }
  },
};
