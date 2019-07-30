const genUtils = require("../../command_utilities/general_utilities");



module.exports.run = async (bot, message, args) => {

    //if this message wasn't sent by ME, return
    if (message.author.id != "205106238697111552") {
        message.channel.send(`unauthorized access, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    genUtils.sendGlobalMessage(bot, `Thinking`);

}

module.exports.help = {
    name: "test"
}