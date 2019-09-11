const imageUnboxModule = require("../../command_utilities/image_unbox");



module.exports.run = async (bot, message, args) => {
    imageUnboxModule.unboxImage(message, "tutter");
}

module.exports.help = {
    name: "tutter",
    description: "Posts a random tutter from the tutter directory",
    usage: "!tutter",
    example: "!tutter",
    funFacts: [
        `Tutter images were generously supplied by Tara!!!`
    ]
}