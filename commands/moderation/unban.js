const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class Unban extends Command {
    constructor(...args) {
        super(...args, {
            name: 'unban',
            description: 'Unbans An User From The Server',
            category: 'Moderation',
            usage: '[ID]',
            accessableby: 'Administrators',
            slashCommand: true,
            commandOptions: [
                { name: 'member', type: 'STRING', description: 'Member to Unban', required: true },
            ]
        });
    };
    async interactionRun(interaction) {
        try {
            if (!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.reply("**You Don't Have The Permission To Unban Users!**");
            if (!interaction.guild.me.permissions.has("BAN_MEMBERS")) return interaction.reply("**I Don't Have The Permission To Unban Users!**");

            const userID = interaction.options.getString('member');
            let bannedMember;
            
            try {
                bannedMember = await interaction.guild.bans.fetch(userID);
            } catch {
                return interaction.reply("**Please Provide A Valid User Or ID Or The User Is Not Banned!**");
            };

            try {
                await interaction.guild.bans.remove(bannedMember.user.id);
            } catch {
                return interaction.reply(`Couldn't Unban ${bannedMember}`);
            };

            const banEmbed = new MessageEmbed()
                .setColor('WHITE')
                .setAuthor(bannedMember.user.username, bannedMember.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`**${bannedMember.user.tag} Has Been Unbanned From ${interaction.guild.name}**`)
                .setFooter(interaction.guild.name, interaction.guild.iconURL({ dynamic: true }))
                .setTimestamp();
            return interaction.reply({ embeds: [banEmbed] });
        } catch (error) {
            console.error(error);
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`);
        };
    };
};