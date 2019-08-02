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
    name: "test"
}