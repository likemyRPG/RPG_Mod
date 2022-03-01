const Command = require('../../structures/Command');
const { MessageEmbed, version } = require('discord.js');
const config = require("../../config.json")

module.exports = class Uptime extends Command {
    constructor(...args) {
        super(...args, {
            name: 'uptime',
            description: 'Gives The Uptime Of The Bot',
            category: 'info',
            accessableby: 'Everyone',
            slashCommand: true
        });
    };

    async interactionRun(interaction) {
        try {
            let seconds = Math.floor(this.bot.user.uptime / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);
            let days = Math.floor(hours / 24);
    
            seconds %= 60;
            minutes %= 60;
            hours %= 24;

            const confirmEmbed = new MessageEmbed()
                .setColor('WHITE')
                .setTitle(`Uptime`)
                .setDescription("`"+ days + "` day(s) `"+ hours + "` hours `" + minutes + "` minutes `"+ seconds + "` seconds")
                .setFooter(this.bot.user.username, this.bot.user.displayAvatarURL())
                .setTimestamp();
            return interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: config.errorMessage, ephemeral: true });
        };
    };
};