const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile("./data/userData.json", function (userDataJson) {

        if (!utilitiesModule.checkNested(userDataJson, message.author.id, "power"))
            message.channel.send("You have to run !power first, " + utilitiesModule.getRandomNameInsult());
        else {
            let currentDate = new Date();
            let checkDateStr = JSON.parse(userDataJson[message.author.id].nextValidPowerCheck);
            let checkDate = new Date(checkDateStr);
    
            let checkDateMS = checkDate.getTime();
            let currentDateMS = currentDate.getTime();
            let differenceMS = checkDateMS - currentDateMS;
    
            let secondsLeft = Math.floor((differenceMS / 1000) % 60);
            let minutesLeft = Math.floor((differenceMS / (1000 * 60)) % 60);
            let hoursLeft = Math.floor((differenceMS / (1000 * 60 * 60)) % 24);
            
            if (userDataJson[message.author.id].power == 69) {
                message.reply(`your current power level is ${userDataJson[message.author.id].power}, which means you cannot reassess your power. Use '!prestige' to reset your power back to 0 and increase your prestige level`);
                utilitiesModule.incrementUserDataValue(message.author, "flexCount", 1);
            }
            else {
                if (hoursLeft <= 0 && minutesLeft <= 0 && secondsLeft <= 0)
                    message.reply(`your current power level is ${userDataJson[message.author.id].power}, and you may reassess your power right now`);
                else
                    message.reply(`your current power level is **${userDataJson[message.author.id].power}**, and you may reassess your power in **${hoursLeft} hours, ${minutesLeft} minutes, and ${secondsLeft} seconds**`);
            }
        }
    
    });
}

module.exports.help = {
    name: "powercheck"
}