const Command = require("../../structures/Command");
const { MessageEmbed, User } = require('discord.js');
const config = require('../../config.json');


module.exports = class Nickname extends Command {
    constructor(...args) {
        super(...args, {
            name: 'nickname',
            category: 'moderation',
            description: 'Set Nickname',
            usage: '<user> <nickname>',
            accessableby: 'Administrators',
            slashCommand: true,
            commandOptions: [
                { name: 'user', type: 'USER', description: 'User', required: true },
                { name: 'nickname', type: 'STRING', description: 'Nickname', required: true }
            ]
        });
    };

    async interactionRun(interaction) {
        try {
            const user = interaction.options.getUser('user');
            const nick = interaction.options.getString('nickname');

            if (!interaction.member.permissions.has("MANAGE_GUILD")) return interaction.reply({ content: "**You Don't Have The Permission To Set Nicknames!**", ephemeral: true });
            if (!interaction.guild.me.permissions.has("KICK_MEMBERS")) return interaction.reply({ content: "**I Don't Have The Permission To Set Nicknames!**", ephemeral: true });

            let member = interaction.guild.members.cache.get(user.id);

            if (!member.kickable) return interaction.reply({ content: "**I Don't Have The Permission To Set This Nickname!**", ephemeral: true });

            member.setNickname(nick);

            const confirmEmbed = new MessageEmbed()
            .setColor("WHITE")
            .setTitle('Nickname changed')
            .setDescription(`${user}'s nick has been changed`)
            .addField(`Old Nickname`, `\`${user.username}\``, true)
            .addField(`New Nickname`, `\`${nick}\``, true)
            .setTimestamp();
        return interaction.reply({ embeds: [confirmEmbed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: config.errorMessage, ephemeral: true });
        };
    };
};