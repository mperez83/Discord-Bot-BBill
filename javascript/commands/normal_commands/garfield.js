const garfield = require("garfield");

const genUtils = require('../../command_utilities/general_utilities');



module.exports.run = async (bot, message, args) => {

    let url = garfield.random();
    message.channel.send(url);
    let reverenceAmount = Math.ceil(Math.random() * 100) + 10;
    genUtils.incrementUserDataValue(message.author, "garfieldReverence", reverenceAmount);

}

module.exports.help = {
    name: "garfield"
}