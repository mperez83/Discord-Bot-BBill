const garfield = require("garfield");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    let url = garfield.random();
    message.channel.send(url);
    let reverenceAmount = Math.ceil(Math.random() * 100) + 10;
    utilitiesModule.incrementUserDataValue(message.author, "garfieldReverence", reverenceAmount);
}

module.exports.help = {
    name: "garfield"
}