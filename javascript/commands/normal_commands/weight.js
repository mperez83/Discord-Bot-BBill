const fs = require("fs");
const getSize = require('get-folder-size');

const utilitiesModule = require('../../utilities');



module.exports.run = async (bot, message, args) => {

    message.channel.send(`Alright hold on, I'm getting on the scale`);
    getSize(`../Discord-Bot-BBill/`, (err, size) => {
        if (err) { throw err; }
        
        message.channel.send(`I weigh about **${(size / 1024 / 1024 / 1024).toFixed(2)} gb**`);
    });

}

module.exports.help = {
    name: "weight"
}