const fs = require("fs");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile("./data/indexImageData.json", function (indexListJson) {

        if (args.length == 0) {
            message.channel.send("I can't index nothing, " + utilitiesModule.getRandomNameInsult());
            return;
        }

        let inputIndexName = args.join(" ");
        
        if (inputIndexName.length > 50) {
            message.channel.send("Index names need to be less than 50 characters long, " + utilitiesModule.getRandomNameInsult());
            return;
        }

        if (indexListJson[inputIndexName]) {
            message.channel.send("That name is already indexed, " + utilitiesModule.getRandomNameInsult());
            return;
        }

        utilitiesModule.getMostRecentImageURL(message).then(validURL => {

            if (!validURL) {
                return;
            }
            else {
                //Check if the url we're trying to index already exists
                for (var indexEntry in indexListJson) {
                    if (indexListJson.hasOwnProperty(indexEntry)) {
                        if (validURL == indexListJson[indexEntry].url) {
                            message.channel.send("That image is already indexed under '" + indexEntry + "', " + utilitiesModule.getRandomNameInsult());
                            return;
                        }
                    }
                }

                indexListJson[inputIndexName] = {
                    url: validURL,
                    culprit: message.author.username
                };

                fs.writeFileSync("./data/indexImageData.json", JSON.stringify(indexListJson));
                message.channel.send("Successfully indexed '" + inputIndexName + "'!");

                if (message.channel.type == "dm") {
                    utilitiesModule.incrementUserDataValue(message.author, "stealthyBastardPoints", 1);
                }
            }

        });
        
    });
}

module.exports.help = {
    name: "index"
}