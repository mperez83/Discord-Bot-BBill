const imageUnboxModule = require("../../command_utilities/image_unbox");



module.exports.run = async (bot, message, args) => {
    imageUnboxModule.unboxImage(message);
}

module.exports.help = {
    name: "ham"
}