const dbUtils = require(`../../database_stuff/index_image_database_handler`);
const genUtils = require("../../command_utilities/general_utilities");



module.exports.run = async (bot, message, args) => {

    //Whitelist check if this server is ok to use the command (whitelisted users bypass this restriction)
    try {
        if (!genUtils.verifyWhitelistCommandCall(message, "index")) return;
    }
    catch (err) {
        console.error(err); //Only occurs if the command_whitelist is malformed in some way, or if the above "index" parameter is misspelled
    }

    if (args.length == 0) {
        message.channel.send(`I can't index nothing, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }

    let inputIndexName = args.join(" ");
    
    if (inputIndexName.length > 50) {
        message.channel.send(`Index names can't be longer than 50 characters, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    genUtils.getMostRecentImageURL(message).then((validURL) => {

        if (!validURL) {
            return;
        }
        else {

            let indexEntry = dbUtils.getIndexedImageByName(message.guild, inputIndexName);
            
            if (indexEntry.index_name) {
                message.channel.send(`That name is already indexed, ${genUtils.getRandomNameInsult(message)}`);
                return;
            }

            if (dbUtils.getIndexedImageByUrl(message.guild, validURL)) {
                message.channel.send(`That image is already indexed under "${dbUtils.getIndexedImageByUrl(message.guild, validURL).index_name}", ${genUtils.getRandomNameInsult(message)}`);
                return;
            }
            
            indexEntry.index_name = inputIndexName;
            indexEntry.url = validURL;
            indexEntry.culprit = message.author.username;
            
            dbUtils.setImageIndex(message.guild, indexEntry);

            message.channel.send(`Successfully indexed "${inputIndexName}"!`);

            if (message.channel.type == "dm") {

            }
            
        }

    });

}

module.exports.help = {
    name: "index",
    description: "Indexes the most recently posted image (wihtin ten messages) under the given name",
    usage: "!index (name)",
    example: "!index when you get the victory royale",
    funFacts: [
        "There used to be a way to delete existing indices, but that has since been removed. The index pool is an ever growing cacophony with (virtually) \
        no way to determine who indexed what."
    ]
}