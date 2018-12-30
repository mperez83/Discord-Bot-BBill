const fs = require("fs");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile("./data/userData.json", function (data) {
        if (!data[message.author.id]) data[message.author.id] = {};
        data[message.author.id].username = message.author.username;
        fs.writeFile("./data/userData.json", JSON.stringify(data), function(err) {
            if (err) return err;
            message.reply(` I now know your current username`);
        });
    });
}

module.exports.help = {
    name: "updateusername"
}