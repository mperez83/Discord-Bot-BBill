const imageUnboxModule = require("../../command_utilities/image_unbox");



module.exports.run = async (bot, message, args) => {
    imageUnboxModule.unboxImage(message, "pikachu");
}

module.exports.help = {
    name: "pikachu",
    description: "Posts a random pikachu from the pikachu directory",
    usage: "!pikachu",
    example: "!pikachu",
    funFacts: [
        `Pikachu was planned for a while, but I kept pushing it down the todo list. At some point, I wanted to prove to myself how fast I could set up a new \
        image unboxing command with the infrastructure I set up, and ended up being able to set up !pikachu in under ten minutes.`
    ]
}