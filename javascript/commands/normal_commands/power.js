const fs = require("fs");

const genUtils = require('../../command_utilities/general_utilities');
const ahm = require("../../command_utilities/achievement_handler");

const dataLoc = "./data/general_data/user_data.json";



module.exports.run = async (bot, message, args) => {
    genUtils.readJSONFile(dataLoc, function (userDataJson) {

        let doPowerCheck = false;
        let currentDate = new Date();

        let user = message.author;
        let userObj = userDataJson[user.id];

        if (!userObj) userObj = {username: user.username};

        if (!userObj.power) {
            userObj.power = 0;
            userObj.nextValidPowerCheck = undefined;
            doPowerCheck = true;
        }
        else {
            let checkDateStr = JSON.parse(userObj.nextValidPowerCheck);
            let checkDate = new Date(checkDateStr);

            if (userObj.power == 69) {
                message.reply(`you cannot reassess your power level again (already attained best power level. Use !prestige to reset your power back to 0 and increase your prestige level)`);
                return;
            }
            else if (checkDate < currentDate) {
                doPowerCheck = true;
            }
        }

        if (doPowerCheck == true) {
            let power = Math.ceil(Math.random() * 100);
            /*if (userObj.username == "SM980") {
                power *= 0.1;
            }*/
            if (power == 69) {
                message.reply(`your power level is **69.**`);
                genUtils.sendGlobalMessage(bot, `User **${user.username}** just got a power level of 69!!!`);
            }
            else if (power == 100) {
                message.reply("your power level is **100!** Congratulations!");
            }
            else if (power == 1) {
                message.reply("your power level is **1.** smh");
                genUtils.sendGlobalMessage(bot, `User **${user.username}** just got a power level of 1`);
            }
            else {
                message.reply(`your power level is **${power}**`);
            }

            if (power == 68 || power == 70) {
                message.react("😂");
                genUtils.incrementUserDataValue(user, "chokes", 1);
            }

            userObj.power = power;

            let nextValidPowerCheck = new Date();
            nextValidPowerCheck.setDate(currentDate.getDate() + 1);
            userObj.nextValidPowerCheck = JSON.stringify(nextValidPowerCheck);

            genUtils.incrementUserDataValue(user, "powerCalls", 1);

            //userDataJson[user.id] = userObj;
            fs.writeFileSync(dataLoc, JSON.stringify(userDataJson, null, 4), function(err) {if (err) return err;});
        }
        else {
            let checkDateStr = JSON.parse(userObj.nextValidPowerCheck);
            let checkDate = new Date(checkDateStr);

            let checkDateMS = checkDate.getTime();
            let currentDateMS = currentDate.getTime();
            let differenceMS = checkDateMS - currentDateMS;

            let secondsLeft = Math.floor((differenceMS / 1000) % 60);
            let minutesLeft = Math.floor((differenceMS / (1000 * 60)) % 60);
            let hoursLeft = Math.floor((differenceMS / (1000 * 60 * 60)) % 24);

            if (hoursLeft == 24 && minutesLeft == 0 && secondsLeft == 0) {
                ahm.awardAchievement(message, ahm.achievement_list_enum.POWER_HUNGRY);
            }
            else if (hoursLeft == 0 && minutesLeft == 0 && secondsLeft == 0) {
                ahm.awardAchievement(message, ahm.achievement_list_enum.TIME_DILATION);
            }

            message.reply(`you may reassess your power in ** ${hoursLeft} hour${(hoursLeft != 1) ? 's' : ''}, ${minutesLeft} minute${(minutesLeft != 1) ? 's' : ''}, and ${secondsLeft} second${(secondsLeft != 1) ? 's' : ''}**`);
        }

    });
}

module.exports.help = {
    name: "power"
}