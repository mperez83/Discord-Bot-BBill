const fs = require("fs");

const utilitiesModule = require('../../utilities');
const ahm = require("../../achievementHandler");

const dataLoc = "./data/general_data/userData.json";



module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile(dataLoc, function (userDataJson) {

        //If the user tried to supply some kind of argument, cut that shit right off
        if (args.length > 0) {
            message.channel.send(`do not tarnish your presige call with arguments, ${utilitiesModule.getRandomNameInsult(message)}`);
            return;
        }

        if (!userDataJson[message.author.id]) userDataJson[message.author.id] = {username: message.author.username};

        if (!userDataJson[message.author.id].power) {
            userDataJson[message.author.id].power = 0;
            userDataJson[message.author.id].nextValidPowerCheck = undefined;
        }

        if (userDataJson[message.author.id].power == 69) {
            userDataJson[message.author.id].power = 0;
            utilitiesModule.incrementUserDataValue(message.author, "prestigeLevel", 1);
            fs.writeFileSync(dataLoc, JSON.stringify(userDataJson, null, 4));
            message.reply(`you're now 1 better than everyone else`);
            ahm.awardAchievement(message, ahm.achievement_list_enum.FIRST_PRESTIGE);
            return;
        }
        else {
            message.reply(`you are not eligible to prestige, ${utilitiesModule.getRandomNameInsult(message)}`);
            return;
        }

    });
}

module.exports.help = {
    name: "prestige"
}