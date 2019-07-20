const genUtils = require("../../command_utilities/general_utilities");

module.exports.run = async (bot, message, args) => {

    //if this message wasn't sent by ME, return
    if (message.author.id != "205106238697111552") {
        message.channel.send(`unauthorized access, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }

    message.channel.send("1");
    message.channel.send("2");
    message.channel.send("3");
    message.channel.send("4");
    message.channel.send("5");
    message.channel.send("6");
    message.channel.send("7");
    message.channel.send("8");
    message.channel.send("9");
    message.channel.send("10");
    message.channel.send("11");

}

module.exports.help = {
    name: "test"
}