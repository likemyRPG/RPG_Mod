const Command = require("../../structures/Command");
const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = class Unlock extends Command {
    constructor(...args) {
        super(...args, {
            name: 'unlock',
            category: 'moderation',
            description: 'Unocks A Channel',
            usage: '[name] (optional)',
            accessableby: 'Administrators',
            slashCommand: true,
            commandOptions: [
                { name: 'channel', type: 'CHANNEL', description: 'Channel', required: false },
                { name: 'reason', type: 'STRING', description: 'Reason', required: false }
            ]
        });
    };

    async interactionRun(interaction) {
        try {
            const everyone = interaction.guild.roles.cache.find((role) => role.name === "@everyone")
            const channel = interaction.options.getChannel('channel') || interaction.channel;
            if (!channel) return interaction.reply('**Channel Not Found!**');

            if (!this.bot.user.lockit) this.bot.user.lockit = [];
            
            channel.permissionOverwrites.create(everyone, {
                SEND_MESSAGES: true
              })

              const lockedChannel = new MessageEmbed()
              .setColor("WHITE")
              .setTitle('Channel unlocked')
              .setDescription(reason)
              .setFooter(this.bot.user.username, this.bot.user.displayAvatarURL())
              .setTimestamp();
          channel.send({ embeds: [lockedChannel]});

            const confirmEmbed = new MessageEmbed()
            .setColor("WHITE")
            .setTitle('You unlocked channel ' + channel)
            .setDescription('Reason: ' + reason)
            .setFooter(this.bot.user.username, this.bot.user.displayAvatarURL())
            .setTimestamp();
        return interaction.reply({ embeds: [confirmEmbed], ephemeral: true  });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: config.errorMessage, ephemeral: true });
        };
    };
};