const Command = require('../../structures/Command');
const { MessageEmbed, version } = require('discord.js');
const fetch = require('node-fetch');
const config = require("../../config.json")

module.exports = class Qotd extends Command {
    constructor(...args) {
        super(...args, {
            name: 'qotd',
            description: 'QOTD',
            category: 'utility',
            accessableby: 'Everyone',
            slashCommand: true
        });
    };

    async interactionRun(interaction) {
        try {
            async function getQuote() {
                let quote = await fetch('https://api.quotable.io/random').then(res => res.json());
                return quote;
            };

            let quote = await getQuote();
            let quoteEmbed = new MessageEmbed()
                .setColor('WHITE')
                .setTitle(`Quote of the Day`)
                .setDescription(`${quote.content}\n\n- *${quote.author}*`)
                // Set the thumbnail of the embed to a picture about the subject
                .setThumbnail(`https://quotes.rest/quote/${quote.id}`)
            return interaction.reply({ embeds: [quoteEmbed] });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: config.errorMessage, ephemeral: true });
        };
    };
};