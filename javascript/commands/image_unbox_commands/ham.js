const imageUnboxModule = require("../../imageUnbox");



module.exports.run = async (bot, message, args) => {
    imageUnboxModule.unboxImage(message);
}

module.exports.help = {
    name: "ham"
}