const imageUnboxModule = require("../../command_utilities/image_unbox");



module.exports.run = async (bot, message, args) => {
    imageUnboxModule.unboxImage(message, "cat");
}

module.exports.help = {
    name: "cat",
    description: "Posts a random cat from the cat directory",
    usage: "!cat",
    example: "!cat",
    funFacts: [
        `All of the cats were donated by Kordell and Bianca, over the course of two days.`,
        `Cat was the fourth image unboxing command to be implemented.`,
        `Multiple cat expansion packs have been added as time went on; however, they aren't announced when they're added.`
    ]
}