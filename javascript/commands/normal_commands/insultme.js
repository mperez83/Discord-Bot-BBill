const genUtils = require('../../command_utilities/general_utilities');



module.exports.run = async (bot, message, args) => {
    message.channel.send(`Hey, **${genUtils.getRandomNameInsult(message)}**`);
}

module.exports.help = {
    name: "insultme"
}