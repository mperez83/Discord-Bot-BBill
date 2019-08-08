const genUtils = require('../../command_utilities/general_utilities');



module.exports.run = async (bot, message, args) => {
    message.channel.send(`Hey, **${genUtils.getRandomNameInsult(message)}**`);
}

module.exports.help = {
    name: "insultme",
    description: "Pulls a random insult from Big Bill's dictionary for the user",
    usage: "!insultme",
    example: "!insultme",
    funFacts: [
        "This command was initially made to help test some text-parsing functionalities related to hyphen separated files. I eventually opted for \
        static JSON files that are loaded at compile time, making its initial purpose obsolete, but it's stuck around since then."
    ]
}