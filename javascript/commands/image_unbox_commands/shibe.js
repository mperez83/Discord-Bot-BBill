const imageUnboxModule = require("../../imageUnbox");



module.exports.run = async (bot, message, args) => {
    imageUnboxModule.unboxImage(message);
    utilitiesModule.incrementUserDataValue(message.author, "shibeCalls", 1);
}

module.exports.help = {
    name: "shibe"
}