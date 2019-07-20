const fs = require("fs");

const genUtils = require('../../command_utilities/general_utilities');
const ahm = require("../../command_utilities/achievement_handler");

const dataLoc = "./data/general_data/user_data.json";



module.exports.run = async (bot, message, args) => {
    genUtils.readJSONFile(dataLoc, function (userDataJson) {

        //If the user tried to supply some kind of argument, cut that shit right off
        if (args.length > 0) {
            message.channel.send(`do not tarnish your presige call with arguments, ${genUtils.getRandomNameInsult(message)}`);
            return;
        }

        if (!userDataJson[message.author.id]) userDataJson[message.author.id] = {username: message.author.username};

        if (!userDataJson[message.author.id].power) {
            userDataJson[message.author.id].power = 0;
            userDataJson[message.author.id].nextValidPowerCheck = undefined;
        }

        if (userDataJson[message.author.id].power == 69) {
            userDataJson[message.author.id].power = 0;
            genUtils.incrementUserDataValue(message.author, "prestigeLevel", 1);
            fs.writeFileSync(dataLoc, JSON.stringify(userDataJson, null, 4));
            message.reply(`you're now 1 better than everyone else`);
            ahm.awardAchievement(message, ahm.achievement_list_enum.FIRST_PRESTIGE);
            return;
        }
        else {
            message.reply(`you are not eligible to prestige, ${genUtils.getRandomNameInsult(message)}`);
            return;
        }

    });
}

module.exports.help = {
    name: "prestige"
}