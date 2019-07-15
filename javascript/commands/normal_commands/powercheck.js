const utilitiesModule = require('../../utilities');

const dataLoc = "./data/general_data/userData.json";



module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile(dataLoc, function (userDataJson) {

        let user = message.author;
        let userObj = userDataJson[user.id];

        if (!userObj || !userObj.power) {
            message.channel.send(`You have to run !power first, ${utilitiesModule.getRandomNameInsult(message)}`);
            return;
        }
        else {
            let currentDate = new Date();
            let checkDateStr = JSON.parse(userObj.nextValidPowerCheck);
            let checkDate = new Date(checkDateStr);
    
            let checkDateMS = checkDate.getTime();
            let currentDateMS = currentDate.getTime();
            let differenceMS = checkDateMS - currentDateMS;
    
            let secondsLeft = Math.floor((differenceMS / 1000) % 60);
            let minutesLeft = Math.floor((differenceMS / (1000 * 60)) % 60);
            let hoursLeft = Math.floor((differenceMS / (1000 * 60 * 60)) % 24);
            
            if (userObj.power == 69) {
                message.reply(`your current power level is ${userObj.power}, which means you cannot reassess your power. Use '!prestige' to reset your power back to 0 and increase your prestige level`);
                utilitiesModule.incrementUserDataValue(user, "flexCount", 1);
            }
            else {
                if (hoursLeft <= 0 && minutesLeft <= 0 && secondsLeft <= 0)
                    message.reply(`your current power level is ${userObj.power}, and you may reassess your power right now`);
                else
                    message.reply(`your current power level is **${userObj.power}**, and you may reassess your power in **${hoursLeft} hour${(hoursLeft != 1) ? 's' : ''}, ${minutesLeft} minute${(minutesLeft != 1) ? 's' : ''}, and ${secondsLeft} second${(secondsLeft != 1) ? 's' : ''}**`);
            }
        }
    
    });
}

module.exports.help = {
    name: "powercheck"
}