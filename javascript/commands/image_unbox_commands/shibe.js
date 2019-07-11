const imageUnboxModule = require("../../imageUnbox");
const utilitiesModule = require("../../utilities");
const ahm = require("../../achievementHandler");



module.exports.run = async (bot, message, args) => {
    imageUnboxModule.unboxImage(message);
    utilitiesModule.incrementUserDataValue(message.author, "shibeCalls", 1);
    
    if (utilitiesModule.getUserDataValue(message.author, "shibeCalls") >= 1000) {
        ahm.awardAchievement(message, ahm.achievement_list_enum.SHIBA_LOVER);
    }
}

module.exports.help = {
    name: "shibe"
}