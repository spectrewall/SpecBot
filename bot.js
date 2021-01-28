require("dotenv").config();
const Twit = require("twit");
const Discord = require("discord.js");
const { Client, Collection } = Discord;
const mongoose = require("mongoose");
const { prefix, events } = require("./config.json");
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

  //MongoDB connection
  mongoose
    .connect(process.env.MONGO_CONNECT_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB Conectado...");
    })
    .catch((err) => {
      console.log("Houve um erro ao se conectar ao mongoDB: " + err);
    });

  const guildSchema = mongoose.Schema({
    GUILD_ID: {
      type: String,
      require: true,
      unique: true,
    },
    CHANNEL_ID: {
      type: String,
      require: true,
    },
  });

  //collection
  mongoose.model("guilds", guildSchema);

  //Twitter Stream on
  const stream = T.stream("statuses/filter", {
    follow: [process.env.TWITTER_USER_ID],
  });

  stream.on("tweet", async ({ text }) => {
    const RegisteredGuild = mongoose.model("guilds");
    RegisteredGuild.find({}, function (err, guildsids) {
      if (err) throw err;
      console.log(guildsids.length);
      guildsids.forEach(async function (element, index, array) {
        let messages = [];
        const channel = await client.channels.fetch(
          guildsids[index].CHANNEL_ID
        );
        const guild = await client.guilds.fetch(guildsids[index].GUILD_ID);
        const roles = await guild.roles.fetch();

        events.forEach(async (event) => {
          if (text.search(event.name) > -1) {
            let message = "";

            const role = roles.cache.find((role) => role.name === event.name);
            if (role) message += `<@&${role.id}> `;

            message += event.message;
            messages.push(message);
          }
        });

        channel.send(messages.join("\n"));
      });
    });
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
  //if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let comando = args.shift().toLowerCase();

  if (comando.length === 0) return;

  let command = client.commands.get(comando);
  if (!command) command = client.commands.get(client.aliases.get(comando));

  if (command) command.run(client, message, args);
});

client.login(process.env.TOKEN);
