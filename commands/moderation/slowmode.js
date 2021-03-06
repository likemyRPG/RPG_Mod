const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');



module.exports = class Slowmode extends Command {
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

            if (!interaction.member.permissions.has("MANAGE_GUILD")) return interaction.reply({ content: "**You Don't Have The Permission To Do This!**", ephemeral: true });

            interaction.channel.setRateLimitPerUser(duration)
            
            const confirmEmbed = new MessageEmbed()
            .setColor("WHITE")
            .setTitle('Slowmode set to ' + duration)
            .setTimestamp();
        return interaction.reply({ embeds: [confirmEmbed]});
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: config.errorMessage, ephemeral: true });
        };
    };
};