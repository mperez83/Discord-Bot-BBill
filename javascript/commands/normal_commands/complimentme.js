const utilitiesModule = require('../../utilities');



module.exports.run = async (bot, message, args) => {
    message.channel.send(`no`);
    //utilitiesModule.incrementUserDataValue(message.author, "falseHope", 1);
}

module.exports.help = {
    name: "complimentme"
}