const Event = require('../../structures/Event');
const { MessageEmbed } = require('discord.js');
const RemindList = require("../../structures/models/RemindList");
const cron = require('cron');
const fetch = require('node-fetch');

module.exports = class Ready extends Event {
	constructor(...args) {
		super(...args, {
			once: true
		});
	};

	async run() {
		try {
			let slashCommands = this.bot.commands.filter(command => command.slashCommand);
			let data = [];

			for (const [key, value] of slashCommands) {
				data.push({ name: key, description: value.description, options: value.commandOptions });
			};

			await this.bot.application.commands.set(data);
			console.log(`${this.bot.user.username} is Online!`);

			const totalReminders = await RemindList.find({});

			let quoteOfTheDay = new cron.CronJob('0 20 2 * * *', async () => {
				const quote = await fetch('https://api.quotable.io/random').then(res => res.json());
				const quoteEmbed = new MessageEmbed()
					.setColor('WHITE')
					.setTitle(`Quote of the Day`)
					.setDescription(`${quote.content}\n\n- *${quote.author}*`)
				this.bot.channels.cache.get('978799822884700220').send({ embeds: [quoteEmbed] });
			});
			quoteOfTheDay.start();
			
			let jokeOfTheDay = new cron.CronJob('0 20 2 * * *', async () => {
				const joke = await fetch('https://sv443.net/jokeapi/v2/joke/Any').then(res => res.json());
				const jokeEmbed = new MessageEmbed()
					.setColor('WHITE')
					.setTitle(`Joke of the Day`)
					.setDescription(`${joke.type === 'single' ? "**" + joke.joke + "**" : "**" + joke.setup + "**" + '\n' + joke.delivery}`)
				this.bot.channels.cache.get('978812392475611176').send({ embeds: [jokeEmbed] });
			});
			jokeOfTheDay.start();

			let daily5Memes = new cron.CronJob('0 20 2 * * *', async () => {
				const memes = await fetch('https://www.reddit.com/r/memes/top.json?t=day&limit=5').then(res => res.json());
				const memeOverview = new MessageEmbed()
					.setColor('WHITE')
					.setTitle(`Top 5 memes of the day | ${new Date().toLocaleDateString()}`)
					.setDescription(`${memes.data.children.map(meme => `[${meme.data.title}](${meme.data.url})`).join('\n')}`)
				this.bot.channels.cache.get('978812616837304390').send({ embeds: [memeOverview] });
				for(let i = 0; i < 5; i++) {
				const memesEmbed = new MessageEmbed()
					.setColor('WHITE')
					.setTitle(`Place ${i + 1}`)
					.setDescription(`[${memes.data.children[i].data.title}}](${memes.data.children[i].data.url})`)
					.setImage(`${memes.data.children[i].data.url}`)
				this.bot.channels.cache.get('978812616837304390').send({ embeds: [memesEmbed] });
				};
			});
			daily5Memes.start();

			for (let i = 0; i < totalReminders.length; i++) {
                const members = await this.bot.guilds.cache.get(totalReminders[i].GuildID).members.fetch();

				let reminderInterval = setInterval(async () => {
					let newReminder = await RemindList.findOne({ ID: totalReminders[i].ID });

					if (!newReminder || newReminder.timeInMS - Date.now() > 0) return;
					let { user } = members.filter(member => !member.bot).get(newReminder.UserID);
					
					await dailyReminder(newReminder, user, this.bot);

					if (newReminder.daily) {
						let parsedTimeForTomorrow = new Date(newReminder.timeInMS);
						parsedTimeForTomorrow.setDate(parsedTimeForTomorrow.getDate() + 1);

						return await RemindList.findOneAndUpdate(
							{ ID: newReminder.ID },
							{
								time: parsedTimeForTomorrow.toString(),
								timeInMS: parsedTimeForTomorrow.getTime(),
							}
						);
					} else if (!newReminder.daily) {
						clearInterval(reminderInterval);
						return await RemindList.deleteOne({ ID: newReminder.ID });
					};
				}, 10000);
			};
		} catch (error) {
			console.error(error);
		};
	};
};

async function dailyReminder(reminder, interaction, bot) {
	const reminderEmbed = new MessageEmbed()
		.setAuthor(interaction.username, interaction.displayAvatarURL({ dynamic: true }))
		.setColor('WHITE')
		.addField(`**Reminder Of ${reminder.time.slice(0, -30).trim()}**`, reminder.reason)
		.setTimestamp();
	reminder.daily ? reminderEmbed.setFooter('Your Daily Reminder By SkyHigh Bot', bot.user.displayAvatarURL({ dynamic: true })) : null;
	return interaction.send({ embeds: [reminderEmbed] }).catch(async () => await RemindList.deleteOne({ ID: generatedID }));
};