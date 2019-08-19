const dbUtils = require(`../../database_stuff/user_database_handler`);
const genUtils = require(`../../command_utilities/general_utilities`);



module.exports.run = async (bot, message, args) => {

    if (args.length > 0) {
        message.channel.send(`do not tarnish your presige call with arguments, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    let user = dbUtils.getPowerLevelEntry(message.author);

    if (user.power != 69) {
        message.reply(`you are not eligible to prestige, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }
    else {
        user.power = 0;
        user.prestige++;
        message.reply(`you are now **${user.prestige}** better than everyone else`);
        dbUtils.setPowerLevelEntry(user);
    }

}

module.exports.help = {
    name: "prestige",
    description: "Enhances the caller if their power level is admirable",
    usage: "!prestige",
    example: "!prestige",
    funFacts: [
        "You already know what power level is considered admirable. Once at this power level, you'll be locked out of doing power calls until prestiging.",
        "Locking users out of power calls until they prestige after attaining the admirable power level was included so that users who mindlessly do power calls \
        wouldn't accidentally overwrite their power level without first acquiring their hard-earned prestige."
    ]
}