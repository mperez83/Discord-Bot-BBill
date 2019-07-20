const imageUnboxModule = require("../../command_utilities/image_unbox");
const genUtils = require("../../command_utilities/general_utilities");
const ahm = require("../../command_utilities/achievement_handler");



module.exports.run = async (bot, message, args) => {
    imageUnboxModule.unboxImage(message);
    genUtils.incrementUserDataValue(message.author, "shibeCalls", 1);
    
    if (genUtils.getUserDataValue(message.author, "shibeCalls") >= 1000) {
        ahm.awardAchievement(message, ahm.achievement_list_enum.SHIBA_LOVER);
    }
}

module.exports.help = {
    name: "shibe"
}