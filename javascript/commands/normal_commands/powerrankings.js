const dbUtils = require(`../../command_utilities/database_utilities`);
const embed_list_handler = require(`../../command_utilities/embed_list_handler`);



module.exports.run = async (bot, message, args) => {
    let powerEntries = dbUtils.getAllPowerLevelEntries();
    let newEmbedList = new embed_list_handler.EmbedList(message, powerEntries, "power", "username");
}

module.exports.help = {
    name: "powerrankings",
    description: "Displays the power levels of all known users",
    usage: "!powerrankings",
    example: "!powerrankings",
    funFacts: [
        "Power rankings used to be actively updated in a channel called \"big-bills-bot-chamber\". This, however, required Big Bill to have permissions \
        that he might not have, such as creating the channel if it didn't exist, and setting the permissions within the channel. Furthermore, the list could \
        theoretically break the 2000 character limit of messages. Because of these reasons, the command was changed to post the list of users in a more \
        compact format.",
        `This was the first command to utilize the embedded list functionality, which was my first time trying to incorporate reusable classes into Big Bill.`
    ]
}