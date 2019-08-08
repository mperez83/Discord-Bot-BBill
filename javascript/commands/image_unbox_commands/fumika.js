const imageUnboxModule = require("../../command_utilities/image_unbox");



module.exports.run = async (bot, message, args) => {
    imageUnboxModule.unboxImage(message);
}

module.exports.help = {
    name: "fumika",
    description: "Posts a random fumika from the fumika directory",
    usage: "!fumika",
    example: "!fumika",
    funFacts: [
        "The folder this pulls from accounts for over 70% of Big Bill's cumulative file size.",
        "Fumikas can be rated! Say Common, Uncommon, Rare, Epic, or Legendary after an image is posted to assign the fumika that rarity.",
        "Fumika was the third image unboxing command to be implemented."
    ]
}