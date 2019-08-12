const imageUnboxModule = require("../../command_utilities/image_unbox");



module.exports.run = async (bot, message, args) => {
    imageUnboxModule.unboxImage(message, "ham");
}

module.exports.help = {
    name: "ham",
    description: "Posts a random ham from the ham directory",
    usage: "!ham",
    example: "!ham",
    funFacts: [
        "Ham contains the smallest amount of images compared to the other image unbox commands.",
        "Hams can be rated! Say Common, Uncommon, Rare, Epic, or Legendary after an image is posted to assign the ham that rarity."
    ]
}