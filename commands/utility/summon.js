const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = class Summon extends Command {
    constructor(...args) {
        super(...args, {
            name: 'summon',
            description: 'Summons A Player To A Channel',
            category: 'Everyone',
            usage: '[mention | ID | username | nickname] (channel)',
            accessableby: 'Administrators',
            slashCommand: true,
            commandOptions: [
                { name: 'member', type: 'USER', description: 'Member to Kick', required: true },
                { name: 'voice', type: 'BOOLEAN', description: 'Is the channel a voice channel?', required: false}
            ]
        });
    };

    async interactionRun(interaction) {
        try {
            let channel = null;
            const author = this.bot.users.cache.get(interaction.member.user.id);
            const member = interaction.options.getMember('member');
            if (!member) return interaction.reply({ content: `**Member not found**`, ephemeral: true });
            if (member === interaction.member) return interaction.reply({ content: `**You can't summon yourself!**`, ephemeral: true })

            if (interaction.options.getBoolean('voice')){
              channel = interaction.member.voice.channel;
              const notInVoiceChannelEmbed = new MessageEmbed()
              .setDescription('You are not in a voice channel!')
              .setColor('RED')
              if(channel === null) return interaction.reply({ embeds: [notInVoiceChannelEmbed], ephemeral: true });
            } else {
                channel = interaction.channel;
            }

            async function createInvite(interaction) {
                let invite = await channel
                .createInvite(
                  {
                    maxAge: 86400,
                    maxUses: 1,
                  },
                  `Requested with "summon" command by ${interaction.author}.`
                )
                .catch(() => {
                  interaction.reply(
                    "There was an error creating the invite, please try again later."
                  ).catch(err => console.log(err));
                });
                const embed = new MessageEmbed()
                .setColor('WHITE')
                .setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`**Hello, You Have Been Summoned By ${author} To The Server ${interaction.guild.name}.**`)
                .addField(`Accept`, `[**REQUEST**](${invite})`, true)
                .addField(`Type Of Channel`, interaction.options.getBoolean('voice') ? `\`Voice Channel\``: `\`Text Channel\``, true)
                .setFooter(interaction.guild.name, interaction.guild.iconURL({ dynamic: true }))
                .setTimestamp();
              member.send({ embeds: [embed]})
                .then(() => {
                  const confirmEmbed = new MessageEmbed()
                  .setDescription(`✅ Summon request successfully sent!`)
                  .setColor('WHITE')
                  interaction.reply({ embeds: [confirmEmbed], ephemeral: true})
                }).catch(() =>
                interaction.reply(
                  "**There was an error sending a message to the requested user. They may have their DMs disabled!**"
                )
              );
            }
            createInvite(interaction);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: config.errorMessage, ephemeral: true });
        };
    };
};