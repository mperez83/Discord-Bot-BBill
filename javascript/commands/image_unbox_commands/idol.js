const imageUnboxModule = require("../../command_utilities/image_unbox");



module.exports.run = async (bot, message, args) => {
    imageUnboxModule.unboxImage(message, "idol");
}

module.exports.help = {
    name: "idol",
    description: "Posts a random idol character from the idol directory",
    usage: "!idol",
    example: "!idol",
    funFacts: [
        `This command is part of the "Give Michael images and no questions asked he'll add them" initiative.`
    ]
}