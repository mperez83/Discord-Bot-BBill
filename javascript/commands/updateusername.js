const fs = require("fs");
const utilitiesModule = require('../utilities');
const dataLoc = "./data/general_data/userData.json";



module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile(dataLoc, function (data) {
        if (!data[message.author.id]) data[message.author.id] = {};
        data[message.author.id].username = message.author.username;
        fs.writeFile(dataLoc, JSON.stringify(data, null, 4), function(err) {
            if (err) return err;
            message.reply(` I now know your current username`);
        });
    });
}

module.exports.help = {
    name: "updateusername"
}