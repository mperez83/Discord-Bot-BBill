const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    message.channel.send(`Hey, **${utilitiesModule.getRandomNameInsult()}**`);
    utilitiesModule.incrementUserDataValue(message.author, "shame", 1);
}

module.exports.help = {
    name: "insultme"
}