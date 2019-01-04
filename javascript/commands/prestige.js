const fs = require("fs");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile("./data/userData.json", function (userDataJson) {

        if (!userDataJson[message.author.id]) userDataJson[message.author.id] = {username: message.author.username};

        if (!utilitiesModule.checkNested(userDataJson, message.author.id, "power")) {
            userDataJson[message.author.id].power = 0;
            userDataJson[message.author.id].nextValidPowerCheck = undefined;
        }

        if (userDataJson[message.author.id].power == 69) {
            userDataJson[message.author.id].power = 0;
            
            let powerfulRole = message.guild.roles.find("name", "Powerful");
            if (!powerfulRole) {
                message.guild.createRole({
                    name: "Powerful",
                    color: "RED",
                    hoist: true,
                    position: 1
                }).then(role => message.member.removeRole(role));
            }
            else {
                message.member.removeRole(powerfulRole);
            }

            utilitiesModule.incrementUserDataValue(message.author, "prestigeLevel", 1);
            fs.writeFileSync("./data/userData.json", JSON.stringify(userDataJson));
            message.reply("you're now 1 better than everyone else");
            return;
        }
        else {
            message.reply("you are not eligible to prestige");
            return;
        }

    });
}

module.exports.help = {
    name: "prestige"
}