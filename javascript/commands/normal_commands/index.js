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

            message.channel.send(`This command needs to be updated to the new information read/write system :(`);

            /*genUtils.readJSONFile(dataLoc, (indexListJson) => {

                //Check if the index name we're trying to index already exists
                if (indexListJson[inputIndexName]) {
                    message.channel.send(`That name is already indexed, ${genUtils.getRandomNameInsult(message)}`);
                    return;
                }

                //Check if the url we're trying to index already exists
                for (let indexEntry in indexListJson) {
                    if (indexListJson.hasOwnProperty(indexEntry)) {
                        if (validURL == indexListJson[indexEntry].url) {
                            message.channel.send(`That image is already indexed under "${indexEntry}", ${genUtils.getRandomNameInsult(message)}`);
                            return;
                        }
                    }
                }

                indexListJson[inputIndexName] = {
                    url: validURL,
                    culprit: message.author.username
                };

                fs.writeFile(dataLoc, JSON.stringify(indexListJson, null, 4), (err) => {
                    if (err) {
                        console.error(err);
                        message.channel.send(`Unable to index "${inputIndexName}"... ${genUtils.getRandomNameInsult(message)}`);
                        return;
                    }

                    message.channel.send(`Successfully indexed "${inputIndexName}"!`);
                    if (message.channel.type == "dm") genUtils.incrementUserDataValue(message.author, "stealthyBastardPoints", 1);
                });

            });*/
            
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