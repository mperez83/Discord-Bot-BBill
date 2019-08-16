const dbUtils = require(`../../command_utilities/database_utilities`);
const genUtils = require(`../../command_utilities/general_utilities`);



module.exports.run = async (bot, message, args) => {

    let user = dbUtils.getPowerLevelEntry(message);

    let currentDate = new Date();
    let checkDate = new Date(user.next_power_check_date);

    if (isNaN(checkDate.getTime())) {
        message.channel.send(`You've never done a power check before! Do one by using the command "!power". ${genUtils.getRandomNameInsult(message)}`);
        return;
    }

    if (user.power == 69) {
        message.reply(`your current power level is **${user.power}**, which means you cannot reassess your power. Use "!prestige" to reset your power back to 0 and increase your prestige level`);
        return;
    }

    let checkDateMS = checkDate.getTime();
    let currentDateMS = currentDate.getTime();
    let differenceMS = checkDateMS - currentDateMS;

    let secondsLeft = Math.floor((differenceMS / 1000) % 60);
    let minutesLeft = Math.floor((differenceMS / (1000 * 60)) % 60);
    let hoursLeft = Math.floor((differenceMS / (1000 * 60 * 60)) % 24);
    
    if (hoursLeft <= 0 && minutesLeft <= 0 && secondsLeft <= 0)
        message.reply(`your current power level is ${user.power}, and you may reassess your power right now`);
    else
        message.reply(`your current power level is **${user.power}**, and you may reassess your power in **${hoursLeft} hour${(hoursLeft != 1) ? 's' : ''}, ${minutesLeft} minute${(minutesLeft != 1) ? 's' : ''}, and ${secondsLeft} second${(secondsLeft != 1) ? 's' : ''}**`);

}

module.exports.help = {
    name: "powercheck",
    description: "Checks the caller's power level, and displays when next they can use the !power command",
    usage: "!powercheck",
    example: "!powercheck",
    funFacts: [
        "!power also tells you when your next power call is, but this command lets users check without potentially prematurely doing a power call."
    ]
}