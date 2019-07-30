const garfield = require("garfield");

const genUtils = require('../../command_utilities/general_utilities');



module.exports.run = async (bot, message, args) => {
    message.channel.send(garfield.random());
}

module.exports.help = {
    name: "garfield"
}