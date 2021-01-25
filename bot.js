require("dotenv").config();
const Discord = require("discord.js");
const { Client, Collection } = Discord;
const config = require("./config.json");
const moment = require("moment");

const client = new Client();
client.commands = new Collection();
client.aliases = new Collection();

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
  if (message.author.bot) {
    if (message.author.username == "CeifahDelicia") {
      let args = message.content;

      let Amlodd = args.search("Amlodd");
      let Cadarn = args.search("Cadarn");
      let Crwys = args.search("Crwys");
      let Hefin = args.search("Hefin");
      let Iorwerth = args.search("Iorwerth");
      let Ithell = args.search("Ithell");
      let Meilyr = args.search("Meilyr");
      let Trahaearn = args.search("Trahaearn");
      let Warbands = args.search("Warbands");

      let canal = client.channels.cache.get("803085418450780180");
      let reply;

      if (Warbands != -1) {
        let Warbands_Role = message.guild.roles.cache.find(
          (Role) => role.name === "Warbands"
        );
        reply = canal.send(
          `@&${Warbands_Role.id} O Wilderness Warbands irá começar em 15 minutos`
        );
      }

      if (Amlodd != -1) {
        let Amlodd_Role = message.guild.roles.cache.find(
          (Role) => role.name === "Amlodd"
        );
        reply = canal.send(
          `@&${Amlodd_Role.id} A voz de Seren agora está ativa no distrito dos Amlodd`
        );
      }

      if (Cadarn != -1) {
        let Cadarn_Role = message.guild.roles.cache.find(
          (Role) => role.name === "Cadarn"
        );
        reply = canal.send(
          `@&${Cadarn_Role} A voz de Seren agora está ativa no distrito dos Cadarn`
        );
      }

      if (Crwys != -1) {
        let Crwys_Role = message.guild.roles.cache.find(
          (Role) => role.name === "Crwys"
        );
        reply = canal.send(
          `@&${Crwys_Role.id} A voz de Seren Agora está ativa no distrito dos Crwys`
        );
      }

      if (Hefin != -1) {
        let Hefin_Role = message.guild.roles.cache.find(
          (Role) => Role.name === "Hefin"
        );
        reply = canal.send(
          `<@&${Hefin_Role.id}> A voz de Seren Agora está ativa no distrito dos Hefin`
        );
      }

      if (Iorwerth != -1) {
        let Iorwerth_Role = message.guild.roles.cache.find(
          (Role) => role.name === "Iorwerth"
        );
        reply = canal.send(
          `@&${Iorwerth_Role.id} A voz de Seren Agora está ativa no distrito dos Iorwerth`
        );
      }

      if (Ithell != -1) {
        let Ithell_Role = message.guild.roles.cache.find(
          (Role) => role.name === "Ithell"
        );
        reply = canal.send(
          `@&${Ithell_Role.id} A voz de Seren Agora está ativa no distrito dos Ithell`
        );
      }

      if (Meilyr != -1) {
        let Meilyr_Role = message.guild.roles.cache.find(
          (Role) => role.name === "Meilyr"
        );
        reply = canal.send(
          `@&${Meilyr_Role.id} A voz de Seren Agora está ativa no distrito dos Meilyr`
        );
      }

      if (Trahaearn != -1) {
        let Trahaearn_Role = message.guild.roles.cache.find(
          (Role) => role.name === "Trahaearn"
        );
        reply = canal.send(
          `@&${Trahaearn} A voz de Seren Agora está ativa no distrito dos Trahaearn`
        );
      }

      return;
    }
  }
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
