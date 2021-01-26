require("dotenv").config();
const Twit = require("twit");
const Discord = require("discord.js");
const { Client, Collection } = Discord;
const config = require("./config.json");
const moment = require("moment");

const client = new Client();
client.commands = new Collection();
client.aliases = new Collection();

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

["command"].forEach((handler) => {
  require(`./handler/${handler}`)(client);
});

client.on("ready", () => {
  console.log(
    `Bot foi iniciado, com ${client.users.cache.size - 1} usuarios, em ${
      client.channels.cache.size
    } canais, em ${client.guilds.cache.size} servidores.`
  );
  client.user.setActivity(`RuneScape`);
  moment.locale("pt-br");
  console.log(`Horario de inicialização: ${moment().format(`LT`)}.`);

  let stream = T.stream("statuses/filter", {
    follow: [process.env.TWITTER_USER_ID],
  });

  stream.on("tweet", function (tweet) {
    //...
    console.log(tweet.text);
    let args = tweet.text;

    let Amlodd = args.search("Amlodd");
    let Cadarn = args.search("Cadarn");
    let Crwys = args.search("Crwys");
    let Hefin = args.search("Hefin");
    let Iorwerth = args.search("Iorwerth");
    let Ithell = args.search("Ithell");
    let Meilyr = args.search("Meilyr");
    let Trahaearn = args.search("Trahaearn");
    let Warbands = args.search("Warbands");

    //let canal = client.channels.cache.get("803000390508478474");
    let canal = client.channels
      .fetch(process.env.DISCORD_CHANNEL_ID)
      .then((guild) => {});
    let servidor = client.guilds
      .fetch(process.env.DISCORD_GUILD_ID)
      .then(console.log);

    if (Warbands != -1) {
      let Warbands_Role = servidor.roles.cache.find(
        (role) => role.name === "Warbands"
      );
      let reply1 = canal.send(
        `<@&${Warbands_Role.id}> O Wilderness Warbands irá começar em 15 minutos`
      );
    }

    if (Amlodd != -1) {
      let Amlodd_Role = servidor.roles.cache.find(
        (role) => role.name === "Amlodd"
      );
      let reply2 = canal.send(
        `<@&${Amlodd_Role.id}> A voz de Seren agora está ativa no distrito dos Amlodd`
      );
    }

    if (Cadarn != -1) {
      let Cadarn_Role = servidor.roles.cache.find(
        (role) => role.name === "Cadarn"
      );
      let reply3 = canal.send(
        `<@&${Cadarn_Role.id}> A voz de Seren agora está ativa no distrito dos Cadarn`
      );
    }

    if (Crwys != -1) {
      let Crwys_Role = servidor.roles.cache.find(
        (role) => role.name === "Crwys"
      );
      let reply4 = canal.send(
        `<@&${Crwys_Role.id}> A voz de Seren Agora está ativa no distrito dos Crwys`
      );
    }

    if (Hefin != -1) {
      let Hefin_Role = servidor.roles.cache.find(
        (role) => role.name === "Hefin"
      );
      let reply5 = canal.send(
        `<@&${Hefin_Role.id}> A voz de Seren Agora está ativa no distrito dos Hefin`
      );
    }

    if (Iorwerth != -1) {
      let Iorwerth_Role = servidor.roles.cache.find(
        (role) => role.name === "Iorwerth"
      );
      let reply6 = canal.send(
        `<@&${Iorwerth_Role.id}> A voz de Seren Agora está ativa no distrito dos Iorwerth`
      );
    }

    if (Ithell != -1) {
      let Ithell_Role = servidor.roles.cache.find(
        (role) => role.name === "Ithell"
      );
      let reply7 = canal.send(
        `<@&${Ithell_Role.id}> A voz de Seren Agora está ativa no distrito dos Ithell`
      );
    }

    if (Meilyr != -1) {
      let Meilyr_Role = servidor.roles.cache.find(
        (role) => role.name === "Meilyr"
      );
      let reply8 = canal.send(
        `<@&${Meilyr_Role.id}> A voz de Seren Agora está ativa no distrito dos Meilyr`
      );
    }

    if (Trahaearn != -1) {
      let Trahaearn_Role = servidor.roles.cache.find(
        (role) => role.name === "Trahaearn"
      );
      let reply9 = canal.send(
        `<@&${Trahaearn_Role.id}> A voz de Seren Agora está ativa no distrito dos Trahaearn`
      );
    }

    return;
  });
});

client.on("guildCreate", (guild) => {
  console.log(
    `O bot entrou no servidor: ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} membros!`
  );
});

client.on("guildDelete", (guild) => {
  console.log(`O bot foi removido do servidor: ${guild.name} (id:{guild.id})`);
});

client.on("message", async (message) => {
  if (message.channel.type === "dm") return;
  //if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  let comando = args.shift().toLowerCase();

  if (comando.length === 0) return;

  let command = client.commands.get(comando);
  if (!command) command = client.commands.get(client.aliases.get(comando));

  if (command) command.run(client, message, args);
});

client.login(process.env.TOKEN);
