const RPG = require('./structures/RPG');
const config = require('./config.json');

const bot = new RPG(config);
bot.start();