const fs = require("fs");

const genUtils = require('../javascript/command_utilities/general_utilities');

const dataLoc = "./data/general_data/userData.json";



module.exports.run = async (bot, message, args) => {

    genUtils.readJSONFile(dataLoc, (data) => {

        if (!data[message.author.id]) data[message.author.id] = {};
        data[message.author.id].username = message.author.username;

        fs.writeFile(dataLoc, JSON.stringify(data, null, 4), (err) => {
            if (err) console.error(err);
            else {
                message.reply(` I now know your current username`);
            }
        });

    });

}

module.exports.help = {
    name: "updateusername"
}