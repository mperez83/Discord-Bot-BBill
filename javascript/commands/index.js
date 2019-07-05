const fs = require("fs");
const utilitiesModule = require("../utilities");
const dataLoc = "./data/general_data/indexImageData.json";



module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile(dataLoc, function (indexListJson) {

        if (args.length == 0) {
            message.channel.send(`I can't index nothing, ${utilitiesModule.getRandomNameInsult(message.author)}`);
            return;
        }

        let inputIndexName = args.join(" ");
        
        if (inputIndexName.length > 50) {
            message.channel.send(`Index names can't be longer than 50 characters, ${utilitiesModule.getRandomNameInsult(message.author)}`);
            return;
        }

        if (indexListJson[inputIndexName]) {
            message.channel.send(`That name is already indexed, ${utilitiesModule.getRandomNameInsult(message.author)}`);
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
                            message.channel.send(`That image is already indexed under "${indexEntry}", ${utilitiesModule.getRandomNameInsult(message.author)}`);
                            return;
                        }
                    }
                }

                indexListJson[inputIndexName] = {
                    url: validURL,
                    culprit: message.author.username
                };

                fs.writeFileSync(dataLoc, JSON.stringify(indexListJson));
                message.channel.send(`Successfully indexed "${inputIndexName}"!`);

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