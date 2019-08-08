const imageUnboxModule = require("../../command_utilities/image_unbox");



module.exports.run = async (bot, message, args) => {
    imageUnboxModule.unboxImage(message);
}

module.exports.help = {
    name: "shibe",
    description: "Posts a shibe ham from the shibe directory",
    usage: "!shibe",
    example: "!shibe",
    funFacts: [
        "Shibe was one of the first commands ever added to Big Bill. All it did back then was post the image, with no Amount Unboxed text or Rarities.",
        "shibeCalls was one of the first stats I ever implemented, in order to help test how reading/writing information to JSON worked.",
        "Komugi is the most common shibe you can unbox. Getting a komugi shibe 1.jpg, however, is considered one of the highest achievements you can attain \
        with Big Bill.",
        "There's well over 2000 shibes that can be pulled."
    ]
}