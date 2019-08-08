const genUtils = require("../../command_utilities/general_utilities");



module.exports.run = async (bot, message, args) => {

    //Check if the user is whitelisted as an admin
    try {
        if (!genUtils.verifyWhitelistCommandCall(message, "admin")) return;
    }
    catch (err) {
        console.error(err);
    }



    genUtils.sendGlobalMessage(bot, `Thinking`);

}

module.exports.help = {
    name: "test",
    description: "Test a specific functionality",
    usage: "!test",
    example: "!test",
    funFacts: [
        "This is an admin command! You probably are not able to use it.",
        "This command changes all the time. It's only used to test very specific functionalities that can't be tested in any other command."
    ]
}