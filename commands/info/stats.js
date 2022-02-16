const Command = require('../../structures/Command');
const { MessageEmbed, version } = require('discord.js');
const config = require("../../config.json")

module.exports = class Stats extends Command {
    constructor(...args) {
        super(...args, {
            name: 'stats',
            description: 'Displays The Stats',
            category: 'Info',
            accessableby: 'Everyone',
            slashCommand: true
        });
    };

    async interactionRun(interaction, client) {
        try {
            const confirmEmbed = new MessageEmbed()
                .setColor('WHITE')
                .setTitle(`Statics of ${config.botname}`)
                .setThumbnail(this.bot.user.displayAvatarURL())
                .addField('Mem Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
                .addField('Discord.js', `v${version}`, true)
                .addField('Node', `${process.version}`, true)
                .setFooter(this.bot.user.username, this.bot.user.displayAvatarURL())
                .setTimestamp();
            return interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`);
        };
    };
};