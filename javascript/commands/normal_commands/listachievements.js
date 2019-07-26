const ahm = require("../../command_utilities/achievement_handler");



module.exports.run = async (bot, message, args) => {

    ahm.getUserAchievementObj(message.author.id, (userAchObj) => {

        let achNames = Object.keys(userAchObj.achievements);

        let msg = `here are your achievements:\n- - - - - - - - - -\n`;
        for (let i = 0; i < achNames.length; i++) {
            if (!ahm.achievement_list[achNames[i]].secret || userAchObj.achievements[achNames[i]] == true){
                if (userAchObj.achievements[achNames[i]] == true)
                    msg += `✅ **${achNames[i]}**\n`;
                else
                    msg += `❌ **${achNames[i]}**\n`;
            }
        }
        msg += `Gamer score: **${userAchObj.gamer_score}**\n`;
        msg += `- - - - - - - - - -`;

        message.reply(msg);
        
    });

}

module.exports.help = {
    name: "listachievements"
}