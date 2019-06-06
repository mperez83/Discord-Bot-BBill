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

        message.channel.fetchMessages({ limit: 10 })
            .then(messagesToCheck => {
                let validURL;

                for (let i = 0; i < messagesToCheck.size; i++) {

                    let curMessage = messagesToCheck.array()[i];
        
                    if (curMessage.attachments.size > 0) {
                        let potentialImage = curMessage.attachments.last();
        
                        //This is the only way I know of to check if an attachment is an image
                        if (potentialImage.width != undefined && potentialImage.height != undefined) {
                            validURL = potentialImage.url;
                            break;
                        }
                    }
        
                    if (curMessage.embeds.length > 0) {
                        let potentialImage = curMessage.embeds[curMessage.embeds.length - 1];
        
                        //This is the only way I know of to check if an embed contains an image
                        if (potentialImage.image != null) {
                            validURL = potentialImage.image.url;
                            break;
                        }
                    }
        
                }

                if (!validURL) {
                    message.channel.send("There weren't any images to index in the last ten messages, " + utilitiesModule.getRandomNameInsult());
                    return;
                }
                else {
                    for (var indexEntry in indexListJson) {
                        if (indexListJson.hasOwnProperty(indexEntry)) {
                            if (validURL == indexListJson[indexEntry].url) {
                                message.channel.send("That image is already indexed under '" + indexEntry + "', " + utilitiesModule.getRandomNameInsult());
                                return;
                            }
                        }
                    }

                    indexListJson[inputIndexName] = {
                        url: validURL
                    };

                    fs.writeFileSync("./data/indexImageData.json", JSON.stringify(indexListJson));
                    message.channel.send("Successfully indexed '" + inputIndexName + "'!");
                }
            })
            .catch(console.error);

    });
}

module.exports.help = {
    name: "index"
}