const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');


module.exports = class Ban extends Command {
    constructor(...args) {
        super(...args, {
            name: 'slowmode',
            description: 'Sets A Slowmode',
            category: 'Moderation',
            usage: '[amount]',
            accessableby: 'Administrators',
            slashCommand: true,
            commandOptions: [
                { name: 'duration', type: 'INTEGER', description: 'Slowmode', required: true }
            ]
        });
    };

    async interactionRun(interaction) {
        try {
            const duration = interaction.options.getInteger('duration');

            interaction.channel.setRateLimitPerUser(duration)
            
            const confirmEmbed = new MessageEmbed()
            .setColor("WHITE")
            .setTitle('Slowmode set to ' + duration)
            .setFooter(this.bot.user.username, this.bot.user.displayAvatarURL())
            .setTimestamp();
        return interaction.reply({ embeds: [confirmEmbed]});
        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`);
        };
    };
};