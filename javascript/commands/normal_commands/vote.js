module.exports.run = async (bot, message, args) => {
    message.react(bot.emojis.get(`628747471513714689`))
        .then(() => message.react(bot.emojis.get(`628747471786606632`)));
}

module.exports.help = {
    name: "vote",
    description: "Quickly provides reactions to the message that can be used to garner a convenient community reaction",
    usage: "!vote [message]",
    example: "!vote mayonaisse is a viable dipping sauce",
    funFacts: [
        `This command uses custom reddit-themed emotes that can only be found in Bills Testing Facility.`
    ]
}