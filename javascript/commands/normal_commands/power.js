const dbUtils = require(`../../database_stuff/user_database_handler`);
const genUtils = require(`../../command_utilities/general_utilities`);



module.exports.run = async (bot, message, args) => {

    let user = dbUtils.getPowerLevelEntry(message.author);

    let currentDate = new Date();
    let checkDate = new Date(user.next_power_check_date);

    if (isNaN(checkDate.getTime()) || checkDate <= currentDate) {

        user.power = Math.ceil(Math.random() * 100);
        user.power_calls++;

        if (message.author.username == "SM980") {
            //user.power *= 0.1;
            //user.power -= 0.0001;
            user.power *= 2;
        }
        if (message.author.username == "Boxinc") {
            user.power *= 4;
        }

        if (user.power == 69) {
            message.reply(`your power level is **69.**`);
            genUtils.sendGlobalMessage(bot, `User **${message.author.username}** just got a power level of 69!!!`);
        }
        else if (user.power == 100) {
            message.reply("your power level is **100!** Congratulations!");
        }
        else if (user.power == 1) {
            message.reply("your power level is **1.** smh");
            genUtils.sendGlobalMessage(bot, `User **${message.author.username}** just got a power level of 1`);
        }
        else {
            message.reply(`your power level is **${user.power}**`);
        }

        if (user.power == 68 || user.power == 70) {
            message.react("😂");
            user.chokes++;
        }
        
        let nextPowerCheckDate = new Date();
        nextPowerCheckDate.setDate(currentDate.getDate() + 1);
        user.next_power_check_date = nextPowerCheckDate.toLocaleString();

        dbUtils.setPowerLevelEntry(user);

    }
    else {

        let checkDateMS = checkDate.getTime();
        let currentDateMS = currentDate.getTime();
        let differenceMS = checkDateMS - currentDateMS;

        let secondsLeft = Math.floor((differenceMS / 1000) % 60);
        let minutesLeft = Math.floor((differenceMS / (1000 * 60)) % 60);
        let hoursLeft = Math.floor((differenceMS / (1000 * 60 * 60)) % 24);

        if (hoursLeft == 24 && minutesLeft == 0 && secondsLeft == 0) {
            //ahm.awardAchievement(message, ahm.achievement_list_enum.POWER_HUNGRY);
        }
        else if (hoursLeft == 0 && minutesLeft == 0 && secondsLeft == 0) {
            //ahm.awardAchievement(message, ahm.achievement_list_enum.TIME_DILATION);
        }

        message.reply(`you may reassess your power in ** ${hoursLeft} hour${(hoursLeft != 1) ? 's' : ''}, ${minutesLeft} minute${(minutesLeft != 1) ? 's' : ''}, and ${secondsLeft} second${(secondsLeft != 1) ? 's' : ''}**`);
        
    }

}

module.exports.help = {
    name: "power",
    description: "Assesses the caller's power level",
    usage: "!power",
    example: "!power",
    funFacts: [
        `Power was initially called "t-count", but when I started adding Big Bill to more servers, I was worried that the concept of counting a user's \
        testosterone would be seen as offensive by some.`,
        `This command was inspired by RockLeeSmiles's twitch bot command "t-count", which would display a random number between 1 and 100 to the chat user.`,
        `Big Bill globally announces to all servers whenever a user gets a noteworthy power level.`,
        `Making the command call all uppercase does not increase your power.`,
        `Power was the first command to be converted to the SQLite database system.`,
        `In the old JSON database system, rapid power calls would sometimes get overwritten or ignored, causing Big Bill to not record when someone's next \
        power check date was, allowing them to instantly do another power check. We can't have an exploit of that magnitude, can we?`
    ]
}