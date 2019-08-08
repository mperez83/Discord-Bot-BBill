const garfield = require("garfield");

const genUtils = require('../../command_utilities/general_utilities');



module.exports.run = async (bot, message, args) => {
    message.channel.send(garfield.random());
}

module.exports.help = {
    name: "garfield",
    description: "Posts a random garfield comic",
    usage: "!gafrield",
    example: "!garfeild",
    funFacts: [
        "There are well over 26^1999 ways to invoke garfield, which is far above theoretical infinity",
        "Garfield was the first comic command to be implemented, but it remained classified as a normal command until explosm, homestuck, \
        and nedroid were implemented."
    ]
}