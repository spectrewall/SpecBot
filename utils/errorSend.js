async function errorSend(client, err, reportMessage, isCommand, message) {
  console.log("\n\nErrorSend:\n\n" + err);
  try {
    console.log("\nEnviando ERROR report para o servidor SpecBot support");
    const canal = await client.channels.fetch(process.env.SUPPORT_CHANNEL);
    canal.send(reportMessage);

    if (isCommand) {
      message.channel.send(
        "Esse comando está indisponível no momento, porém nossos engenheiros já estão trabalhando para consertá-lo!"
      );
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = errorSend;
