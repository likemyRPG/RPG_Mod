const Command = require("../../structures/Command");
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const config = require('../../config.json');


module.exports = class Lock extends Command {
    constructor(...args) {
        super(...args, {
            name: 'crypto',
            category: 'info',
            description: 'Get the current price of a cryptocurrency',
            usage: '',
            accessableby: 'Everyone',
            slashCommand: true,
            commandOptions: [
                { name: 'currency', type: 'STRING', description: 'CryptoCurrency', required: true }
            ]
        });
    };

    async interactionRun(interaction) {
        try {
            const validCryptocurrency = (cryptocurrency) => {
                return fetch(`https://api.coingecko.com/api/v3/coins/${cryptocurrency}`)
                    .then(res => res.json())
                    .then(json => {
                        return json.id;
                    })
                    .catch(err => {
                        return false;
                    });
            }

            const getPrice = (cryptocurrency) => {
                return fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptocurrency}&vs_currencies=usd`)
                    .then(res => res.json())
                    .then(json => {
                        return json[cryptocurrency].usd;
                    })
                    .catch(err => {
                        return false;
                    });
            }
            const getGraphOfLastDay = (cryptocurrency) => {
                return fetch(`https://api.coingecko.com/api/v3/coins/${cryptocurrency}/market_chart?vs_currency=usd&days=1`)
                    .then(res => res.json())
                    .then(json => {
                        return json.prices;
                    })
                    .catch(err => {
                        return false;
                    });
            }

            const cryptocurrency = interaction.options.getString('currency');
            const valid = await validCryptocurrency(cryptocurrency);
            if (valid) {
                const embed = new MessageEmbed()
                    .setColor("WHITE")
                    .setTitle(`${cryptocurrency}`)
                    .setDescription(`Current Price: ${await getPrice(cryptocurrency)}`)
                    .setImage(getGraphOfLastDay(cryptocurrency))
                    .setTimestamp();
                await interaction.reply({ embeds: [embed]});
            } else {
                const cryptocurrencies = await fetch(`https://api.coingecko.com/api/v3/coins/list`)
                    .then(res => res.json())
                    .then(json => {
                        return json.map(crypto => crypto.symbol);
                    }
                );
                
                const similarCryptocurrencies = cryptocurrencies.filter(crypto => crypto.toLowerCase().includes(cryptocurrency.toLowerCase()));
                const embed = new MessageEmbed()
                    .setColor("WHITE")
                    .setTitle('Invalid Cryptocurrency')
                    .setDescription(`Did you mean: ${similarCryptocurrencies.slice(0, 5).join(', ')}`)
                    .setTimestamp();
                interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: config.errorMessage, ephemeral: true });
        };
    };
};