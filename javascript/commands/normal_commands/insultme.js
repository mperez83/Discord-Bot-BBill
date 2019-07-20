const genUtils = require('../../command_utilities/general_utilities');



module.exports.run = async (bot, message, args) => {
    message.channel.send(`Hey, **${genUtils.getRandomNameInsult(message)}**`);
    genUtils.incrementUserDataValue(message.author, "shame", 1);
}

module.exports.help = {
    name: "insultme"
}