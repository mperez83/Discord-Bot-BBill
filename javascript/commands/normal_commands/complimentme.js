const genUtils = require('../../command_utilities/general_utilities');



module.exports.run = async (bot, message, args) => {
    message.channel.send(`no`);
    //genUtils.incrementUserDataValue(message.author, "falseHope", 1);
}

module.exports.help = {
    name: "complimentme"
}