const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {

    //if this message wasn't sent by ME, return
    if (message.author.id != "205106238697111552") {
        message.channel.send("unauthorized access, " + utilitiesModule.getRandomNameInsult());
        return;
    }

    else {
        utilitiesModule.sendGlobalMessage(bot, "it is a mystery");
    }

}

module.exports.help = {
    name: "test"
}