const genUtils = require("../../command_utilities/general_utilities");



module.exports.run = async (bot, message, args) => {

    let numberOfCustomEmotes = 1;

    if (args.length == 0) {

    }
    else if (args.length == 1) {
        if (args[0] === "69") {
            numberOfCustomEmotes = 69;
        }
        else {
            numberOfCustomEmotes = genUtils.verifyIntVal(parseInt(args[0]), 1, 10, "Number of custom emotes to find", message);
            if (!numberOfCustomEmotes) return;
        }
    }
    else {
        message.channel.send(`Too many parameters, ${genUtils.getRandomNameInsult(message)}`);
    }

    if (numberOfCustomEmotes == 69) {
        message.channel.send(`🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆`);
        return;
    }

    let randomEmotes = bot.emojis.random(numberOfCustomEmotes);
    let msg = ``;
    for (let i = 0; i < randomEmotes.length; i++) {
        if (randomEmotes[i].animated)
            msg += `<a:${randomEmotes[i].name}:${randomEmotes[i].id}> `;
        else
            msg += `<:${randomEmotes[i].name}:${randomEmotes[i].id}> `;
    }
    message.channel.send(msg);

}

module.exports.help = {
    name: "randomemote",
    description: "Post the provided number of random custom emotes Big Bill has access to",
    usage: "!randomemote [number]",
    example: "!randomemote 5",
    funFacts: [
        "This command was created when I realized discord bots automatically have the global emote pass that typically comes with Discord Nitro."
    ]
}