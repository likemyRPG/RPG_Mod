const Command = require("../../structures/Command");
const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');


module.exports = class Lock extends Command {
    constructor(...args) {
        super(...args, {
            name: 'lock',
            category: 'moderation',
            description: 'Locks A Channel',
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
            const reason = interaction.options.getString('reason') || 'The channel is closed, wait until a moderator reopens it!';
            if (!channel) return interaction.reply('**Channel Not Found!**');

            if (!this.bot.user.lockit) this.bot.user.lockit = [];
            
            channel.permissionOverwrites.create(everyone, {
                SEND_MESSAGES: false
              })

              const lockedChannel = new MessageEmbed()
              .setColor("WHITE")
              .setTitle('Channel locked')
              .setDescription(reason)
              .setFooter(this.bot.user.username, this.bot.user.displayAvatarURL())
              .setTimestamp();
          channel.send({ embeds: [lockedChannel]});

            const confirmEmbed = new MessageEmbed()
            .setColor("WHITE")
            .setTitle('You locked channel ' + channel)
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