const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const config = require('../../config.json')
const BugList = require('../../structures/models/BugList');



module.exports = class About extends Command {
    constructor(...args) {
        super(...args, {
            name: 'bug',
            description: 'Report a bug',
            category: 'Utility',
            accessableby: 'Everyone',
            slashCommand: true,
            commandOptions: [
                { name: 'command', type: 'STRING', description: 'Command To Report', required: true },
                { name: 'explanation', type: 'STRING', description: 'What Do You Want To Report', required: true }
            ]
        });
    };

    async interactionRun(interaction) {
        try {
            const command = interaction.options.getString('command');
            const explanation = interaction.options.getString('explanation');
            const reporter = interaction.member.id;
            const server = interaction.channel.id;
            let channel = this.bot.channels.cache.get(config.bugchannel)


           let bugReport =  await BugList.create({
                reporter: reporter,
                command: command,
                explanation: explanation,
                server: server
            })

            await bugReport.save();

            const bugReportEmbed = new MessageEmbed()
            .setColor('WHITE')
            .setTitle(`Report`)
            .addField(`Command`, command, true)
            .addField(`Reporter`, reporter, true)
            .addField(`Explanation`, explanation)
            .addField(`Server`, server, true)   
            .setTimestamp();
            channel.send({ embeds: [bugReportEmbed] });

            return interaction.reply({content: `Your Report Has Been Send!`, ephemeral: true})


        } catch (error) {
            console.error(error);
            return interaction.reply({ content: config.errorMessage, ephemeral: true });
        };
    };
};