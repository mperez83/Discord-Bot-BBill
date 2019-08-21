const dbUtils = require(`../../database_stuff/index_image_database_handler`);
const genUtils = require("../../command_utilities/general_utilities");



module.exports.run = async (bot, message, args) => {

    //Check if the user is whitelisted as an admin
    try {
        if (!genUtils.verifyWhitelistCommandCall(message, "admin")) return;
    }
    catch (err) {
        console.error(err);
    }

    

    if (args.length == 0) {
        message.channel.send(`I need an index name in order to identify who did it, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }

    let inputIndexCall = args.join(" ");
    let indexEntry = dbUtils.getIndexedImageByName(message.guild, inputIndexCall);

    if (!indexEntry.index_name) {
        message.channel.send(`There is no image indexed with the name "${inputIndexCall}", ${genUtils.getRandomNameInsult(message)}`);
        return;
    }

    message.channel.send(`Culprit: ${indexEntry.culprit}`);

}

module.exports.help = {
    name: "identify",
    description: "Identifies who indexed a particular index",
    usage: "!identify (name)",
    example: "!identify when you get the victory royale",
    funFacts: [
        `This is an admin command! You probably are not able to use it.`,
        `It was requested that whoever indexes something should remain nameless, such that nobody knows who's polluting the pool. I found the idea funny, \
        but just incase it'd make for a funny moment to directly call someone out for indexing something particularly lucrative, I made this command.`
    ]
}