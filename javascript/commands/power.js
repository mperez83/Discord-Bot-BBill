const fs = require("fs");
const utilitiesModule = require('../utilities');
const dataLoc = "./data/general_data/userData.json";



module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile(dataLoc, function (userDataJson) {

        let doPowerCheck = false;
        let currentDate = new Date();

        if (!userDataJson[message.author.id]) userDataJson[message.author.id] = {username: message.author.username};

        if (!utilitiesModule.checkNested(userDataJson, message.author.id, "power")) {
            userDataJson[message.author.id].power = 0;
            userDataJson[message.author.id].nextValidPowerCheck = undefined;
            doPowerCheck = true;
        }
        else {
            let checkDateStr = JSON.parse(userDataJson[message.author.id].nextValidPowerCheck);
            let checkDate = new Date(checkDateStr);

            if (userDataJson[message.author.id].power == 69) {
                message.reply(`you cannot reassess your power level again (already attained best power level. Use !prestige to reset your power back to 0 and increase your prestige level)`);
                return;
            }
            else if (checkDate < currentDate) {
                doPowerCheck = true;
            }
        }

        if (doPowerCheck == true) {
            let power = Math.ceil(Math.random() * 100);
            /*if (userDataJson[message.author.id].username == "SM980") {
                power *= 0.1;
            }*/
            if (power == 69) {
                message.reply(`your power level is **69.** You have attained the POWERFUL role.`);
                utilitiesModule.bequeathPowerfulStatus(message.guild, message.member);
                utilitiesModule.sendGlobalMessage(bot, `User **${message.author.username}** just got a power level of 69!!!`);
            }
            else if (power == 100) {
                message.reply("your power level is **100!** Congratulations!");
            }
            else if (power == 1) {
                message.reply("your power level is **1.** smh");
                utilitiesModule.sendGlobalMessage(bot, `User **${message.author.username}** just got a power level of 1`);
            }
            else {
                message.reply(`your power level is **${power}**`);
            }

            if (power == 68 || power == 70) {
                message.react("😂");
                utilitiesModule.incrementUserDataValue(message.author, "chokes", 1);
            }

            userDataJson[message.author.id].power = power;

            let nextValidPowerCheck = new Date();
            nextValidPowerCheck.setDate(currentDate.getDate() + 1);
            userDataJson[message.author.id].nextValidPowerCheck = JSON.stringify(nextValidPowerCheck);

            utilitiesModule.incrementUserDataValue(message.author, "powerCalls", 1);

            fs.writeFileSync(dataLoc, JSON.stringify(userDataJson), function(err) {if (err) return err;});
        }
        else {
            let checkDateStr = JSON.parse(userDataJson[message.author.id].nextValidPowerCheck);
            let checkDate = new Date(checkDateStr);

            let checkDateMS = checkDate.getTime();
            let currentDateMS = currentDate.getTime();
            let differenceMS = checkDateMS - currentDateMS;

            let secondsLeft = Math.floor((differenceMS / 1000) % 60);
            let minutesLeft = Math.floor((differenceMS / (1000 * 60)) % 60);
            let hoursLeft = Math.floor((differenceMS / (1000 * 60 * 60)) % 24);

            message.reply(`your next power level check is in ** ${hoursLeft} hours, ${minutesLeft} minutes, and ${secondsLeft} seconds**`);
        }

    });
}

module.exports.help = {
    name: "power"
}