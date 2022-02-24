const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const config = require('../../config.json')


module.exports = class About extends Command {
    constructor(...args) {
        super(...args, {
            name: 'about',
            description: 'Displays Some Info',
            category: 'Info',
            accessableby: 'Everyone',
            slashCommand: true
        });
    };

    async interactionRun(interaction, client) {
        try {
            const confirmEmbed = new MessageEmbed()
                .setColor('WHITE')
                .setTitle(`About ${config.botname}`)
                .setThumbnail(this.bot.user.displayAvatarURL())
                .setDescription(`${config.botname} is a multifunctional created by 'likemyRPG#0001'. If you need any help, join the [**\`support\`**](https://discord.gg/RceTKnRMx4) server! If you want to support me? Consider [**\`donating\`**](https://www.buymeacoffee.com/likemyRPG) :)`)
                .setFooter(this.bot.user.username, this.bot.user.displayAvatarURL())
                .setTimestamp();
            return interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`);
        };
    };
};