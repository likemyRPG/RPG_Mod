const Command = require('../../structures/Command');
const { MessageEmbed, version } = require('discord.js');
const config = require("../../config.json")

module.exports = class Support extends Command {
    constructor(...args) {
        super(...args, {
            name: 'support',
            description: 'Gives An Invite To The Support Server',
            category: 'info',
            accessableby: 'Everyone',
            slashCommand: true
        });
    };

    async interactionRun(interaction) {
        try {
            const confirmEmbed = new MessageEmbed()
                .setColor('WHITE')
                .setTitle(`Join the Heaven Of RPG server`)
                .setDescription(`Use this invite [**\`LINK\`**](https://discord.gg/RceTKnRMx4)!`)
                .setFooter(this.bot.user.username, this.bot.user.displayAvatarURL())
                .setTimestamp();
            return interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: config.errorMessage, ephemeral: true });
        };
    };
};