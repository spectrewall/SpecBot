/*module.exports = {

	name: 'confirmar',
	category: 'modaration',
	description: 'asks confirmation from every guild member',

	run: async (client, message, args) => {

		const variaveis = require('../../variaveis/var.js');
		const moment = require('moment');
		const Discord = require('discord.js');

		console.log(`${moment().format(`LT`)}: Comando !confirmar detectado.`);

		let marcacao = message.channel.send('@everyone');
		let embed = new Discord.MessageEmbed()
			.setTitle("ATENÇÃO")
			.setDescription("Você irá continuar participando da guild quando o jogo lançar?\n\nClique no 👍 para confirmar\nsua participação. \n\n **Jogadores Confirmados:**\n")
			.setTimestamp()
			.setColor('1fd14f')

		let msgID;
		message.channel.send(embed).then(embedMessage => {
			embedMessage.react('👍').then(embedMessage => {
				msgID = embedMessage.message;
			});
		});

		let confirmedPlayers = [];

		client.on('messageReactionAdd', (reaction, user) => {
			if (reaction.emoji.name === "👍" && !user.bot && reaction.message === msgID) {

				if (reaction.count - 1 < 2) {

					if (user.username === '0Tage') {

						confirmedPlayers.push('\n- Bot Tage');

						let embed = new Discord.MessageEmbed()
							.setDescription("Você irá continuar participando da guild quando o jogo lançar?\n\nClique no 👍 para confirmar\nsua participação. \n\n **Jogadores Confirmados:**\n" + confirmedPlayers.join(""))
							.setTimestamp()
							.setColor('1fd14f')
							.setTitle("ATENÇÃO")

						msgID.edit(embed);

					}
					else {

						confirmedPlayers.push(`\n- ${user.tag}`);

						let embed = new Discord.MessageEmbed()
							.setDescription("Você irá continuar participando da guild quando o jogo lançar?\n\nClique no 👍 para confirmar\nsua participação. \n\n **Jogadores Confirmados:**\n" + confirmedPlayers.join(""))
							.setTimestamp()
							.setColor('1fd14f')
							.setTitle("ATENÇÃO")

						msgID.edit(embed);

					}

				} else {

					confirmedPlayers.push(`\n- ${user.tag}`);

					let embed = new Discord.MessageEmbed()
						.setDescription("Você irá continuar participando da guild quando o jogo lançar?\n\nClique no 👍 para confirmar\nsua participação. \n\n **Jogadores Confirmados:**\n" + confirmedPlayers.join(""))
						.setTimestamp()
						.setColor('1fd14f')
						.setTitle("ATENÇÃO")

					msgID.edit(embed);

				}

			}

		});
		

		client.on('messageReactionRemove', (reaction, user) => {
			if(reaction.emoji.name === "👍" && !user.bot && reaction.message === msgID){

				if (reaction.users.cache.size - 1 < 2) {

					if (user.username === '0Tage') {

						let i = confirmedPlayers.indexOf('\n- Bot Tage');
						if(i != -1)confirmedPlayers.splice(i, 1);

						let embed = new Discord.MessageEmbed()
							.setDescription("Você irá continuar participando da guild quando o jogo lançar?\n\nClique no 👍 para confirmar\nsua participação. \n\n **Jogadores Confirmados:**\n" + confirmedPlayers.join(""))
							.setTimestamp()
							.setColor('1fd14f')
							.setTitle("ATENÇÃO")

						msgID.edit(embed);

					}
					else {

						let i = confirmedPlayers.indexOf(`\n- ${user.tag}`);
						if(i != -1)confirmedPlayers.splice(i, 1);

						let embed = new Discord.MessageEmbed()
							.setDescription("Você irá continuar participando da guild quando o jogo lançar?\n\nClique no 👍 para confirmar\nsua participação. \n\n **Jogadores Confirmados:**\n" + confirmedPlayers.join(""))
							.setTimestamp()
							.setColor('1fd14f')
							.setTitle("ATENÇÃO")

						msgID.edit(embed);

					}

				} else {

					let i = confirmedPlayers.indexOf(`\n- ${user.tag}`);
					if(i != -1)confirmedPlayers.splice(i, 1);

					let embed = new Discord.MessageEmbed()
						.setDescription("Você irá continuar participando da guild quando o jogo lançar?\n\nClique no 👍 para confirmar\nsua participação. \n\n **Jogadores Confirmados:**\n" + confirmedPlayers.join(""))
						.setTimestamp()
						.setColor('1fd14f')

					msgID.edit(embed);

				}
				
			}
		});


	}
}*/
