const genUtils = require('../../command_utilities/general_utilities');



module.exports.run = async (bot, message, args) => {
    message.channel.send(
`A robust list of commands and how they're used can be found at https://github.com/mperez83/Discord-Bot-BBill
If you want a quick rundown of a specific command, use !help [commandName] to post that.
${genUtils.getRandomNameInsult(message)}`
    );
}

module.exports.help = {
    name: "help"
}