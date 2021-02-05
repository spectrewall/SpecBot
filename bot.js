require("dotenv").config();
const Twit = require("twit");
const Discord = require("discord.js");
const { Client, Collection } = Discord;
const mongoose = require("mongoose");
const { prefix, events, comandos } = require("./config.json");
const moment = require("moment");
const DisTube = require("distube");

const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
client.commands = new Collection();
client.aliases = new Collection();

//DISTUBE

client.distube = new DisTube(client, {
  searchSongs: false,
  emitNewSongOnly: true,
  leaveOnFinish: true,
});

client.distube
  .on("playSong", async (message, queue, song) => {
    let msgID;
    let embed = new Discord.MessageEmbed()
      .setDescription(
        `[${song.name}](${song.url})\nDuração: ${song.formattedDuration}`
      )
      .setTimestamp()
      .setColor("0a1f29")
      .setFooter(
        `Adicionado por ${message.author.tag}`,
        `${message.author.displayAvatarURL()}`
      )
      .setThumbnail(song.thumbnail)
      .setTitle("Tocando Agora");

    msgID = await message.channel.send(embed);
  })
  .on("addSong", async (message, queue, song) => {
    let msgID;
    let embed = new Discord.MessageEmbed()
      .setDescription(
        `[${song.name}](${song.url})\nDuração: ${song.formattedDuration}`
      )
      .setTimestamp()
      .setColor("0a1f29")
      .setFooter(
        `Adicionado por ${message.author.tag}`,
        `${message.author.displayAvatarURL()}`
      )
      .setThumbnail(song.thumbnail)
      .setTitle("Adicionado a Fila!");

    msgID = await message.channel.send(embed);
  })
  .on("addList", async (message, queue, playlist) => {
    let msgID;
    let embed = new Discord.MessageEmbed()
      .setDescription(
        `[${playlist.name}](${playlist.url})\n${playlist.songs.length} Músicas`
      )
      .setTimestamp()
      .setColor("0a1f29")
      .setFooter(
        `Adicionado por ${message.author.tag}`,
        `${message.author.displayAvatarURL()}`
      )
      .setThumbnail(playlist.thumbnail.url)
      .setTitle("PlayList Adicionada!");

    msgID = await message.channel.send(embed);
  })
  .on("playList", async (message, queue, playlist, song) => {
    let msgID;
    let embed = new Discord.MessageEmbed()
      .setDescription(
        `[${playlist.name}](${playlist.url})\n${playlist.songs.length} Músicas\n\n**Tocando Agora**\n[${song.name}](${song.url})\nDuração: ${song.formattedDuration}`
      )
      .setTimestamp()
      .setColor("0a1f29")
      .setFooter(
        `Adicionado por ${message.author.tag}`,
        `${message.author.displayAvatarURL()}`
      )
      .setThumbnail(song.thumbnail)
      .setTitle("PlayList Adicionada!");

    msgID = await message.channel.send(embed);
  })
  .on("initQueue", (queue) => {
    queue.autoplay = false;
    queue.volume = 100;
  });

//TWIT SETTINGS

const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

//HANDLER SETTING

["command"].forEach((handler) => {
  require(`./handler/${handler}`)(client);
});

client.on("ready", () => {
  //LOG MESSAGES
  console.log(
    `Bot foi iniciado, com ${client.users.cache.size - 1} usuários, em ${
      client.channels.cache.size
    } canais, em ${client.guilds.cache.size} servidores.`
  );
  client.user.setActivity("@specbot help");
  moment.locale("pt-br");
  console.log(`Horário de inicialização: ${moment().format(`LT`)}.`);

  //MongoDB connection
  mongoose
    .connect(process.env.MONGO_CONNECT_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
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

  const prefixSchema = mongoose.Schema({
    GUILD_ID: {
      type: String,
      require: true,
      unique: true,
    },
    PREFIX: {
      type: String,
      require: true,
    },
  });

  //collection
  mongoose.model("guilds", guildSchema);
  mongoose.model("prefixes", prefixSchema);

  //Twitter Stream on
  const stream = T.stream("statuses/filter", {
    follow: [process.env.TWITTER_USER_ID],
  });

  stream.on("tweet", async ({ text }) => {
    const RegisteredGuild = mongoose.model("guilds");
    RegisteredGuild.find({}, function (err, guildsids) {
      if (err) throw err;
      console.log(
        `Enviando atualização do RSClockTracker para ${guildsids.length} servidores.`
      );
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

        if (messages.length != 0) channel.send(messages.join("\n"));
      });
    });
  });
});

client.on("guildCreate", (guild) => {
  console.log(
    `O bot entrou no servidor: ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} membros!`
  );
});

client.on("guildDelete", async (guild) => {
  console.log(`O bot foi removido do servidor: ${guild.name} (id:${guild.id})`);
  const RegisteredGuild = await mongoose.model("guilds");
  await RegisteredGuild.findOneAndDelete(
    { GUILD_ID: guild.id },
    function (err, obj) {
      if (obj) console.log(obj + "Removed from Mongo.");
      else console.log("It was not registered in Mongo.");
    }
  );

  const RegisteredPrefix = await mongoose.model("prefixes");
  await RegisteredPrefix.findOneAndDelete(
    { GUILD_ID: guild.id },
    function (err, obj) {
      if (obj) console.log(obj + "Removed from Mongo.");
      else console.log("It was not registered in Mongo.");
    }
  );
});

client.on("message", async (message) => {
  if (message.channel.type === "dm") return;
  if (message.author.bot) return;
  if (message.content.startsWith("<@!802992884436959294>")) {
    if (!message.member)
      message.member = await message.guild.fetchMember(message);

    let args = message.content
      .slice("<@!802992884436959294>".length)
      .trim()
      .split(/ +/g);
    let comando = args.shift().toLowerCase();

    if (comando.length === 0) return;

    let command = client.commands.get(comando);
    if (!command) command = client.commands.get(client.aliases.get(comando));

    if (command) command.run(client, message, args);
  }
  //Checking if message contain a command for DataBase access economy.
  let flag = false;
  comandos.forEach(async (comando) => {
    if (
      message.content.toLowerCase().search(comando.name) > 0 &&
      message.content.toLowerCase().search(comando.name) <= 3
    ) {
      flag = true;
    }
  });
  if (!flag) return;

  //LOAD PREFIX FROM DB
  const guildPrefix = mongoose.model("prefixes");
  guildPrefix.findOne(
    { GUILD_ID: message.channel.guild.id },
    async function (err, result) {
      if (err) throw err;
      if (result) {
        if (!message.content.startsWith(result.PREFIX)) return;
        if (!message.member)
          message.member = await message.guild.fetchMember(message);

        let args = message.content
          .slice(result.PREFIX.length)
          .trim()
          .split(/ +/g);
        let comando = args.shift().toLowerCase();

        if (comando.length === 0) return;

        let command = client.commands.get(comando);
        if (!command)
          command = client.commands.get(client.aliases.get(comando));

        if (command) command.run(client, message, args);
      } else {
        // USES DEFAULT PREFIX
        if (!message.content.startsWith(prefix)) return;
        if (!message.member)
          message.member = await message.guild.fetchMember(message);

        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let comando = args.shift().toLowerCase();

        if (comando.length === 0) return;

        let command = client.commands.get(comando);
        if (!command)
          command = client.commands.get(client.aliases.get(comando));

        if (command) command.run(client, message, args);
      }
    }
  );
});

client.login(process.env.TOKEN);
