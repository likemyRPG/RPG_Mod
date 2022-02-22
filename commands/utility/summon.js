const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

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
            let channel;
            const author = this.bot.users.cache.get(interaction.member.user.id);
            const member = interaction.options.getMember('member');
            if (!member) return interaction.reply('**Member Not Found!**');
            if (member === interaction.member) return interaction.reply(`**You can't summon yourself!**`)

            var voice = interaction.options.getBoolean('voice') || false;

            if (voice){
                let user = await interaction.member.fetch();
                channel = await user.voice.channel;
                console.log(channel);
                const notInVoiceChannelEmbed = new MessageEmbed()
                .setDescription('You are not in a voice channel!')
                .setColor('RED')
                if(!channel) return interaction.reply({ embeds: [notInVoiceChannelEmbed], ephemeral: true });
            }

            if(!channel) channel = interaction.channel;


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
                .addField(`Type Of Channel`, voice ? `\`Voice Channel\``: `\`Text Channel\``, true)
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
            return interaction.reply(`An Error Occurred: \`${error.message}\`!`);
        };
    };
};