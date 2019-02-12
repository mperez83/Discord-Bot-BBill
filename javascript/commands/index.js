const fs = require("fs");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile("./data/indexImageData.json", function (indexListJson) {

        if (args.length == 0) {
            message.channel.send("I can't index nothing, " + utilitiesModule.getRandomNameInsult());
            return;
        }

        let inputIndexName = args.join(" ");
        //inputIndexName = inputIndexName.toLowerCase();
        
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
                for (let i = (messagesToCheck.size - 1); i >= 0; i--) {
                    //This part sucks. We have to go step-by-step and check if every element of the attachment/embed is undefined, because straight up doing
                    //"if (messagesToCheck.array()[i].attachments.first().url != undefined)" causes it to crash when it tries to check the .url of a key that
                    //doesn't exist. We have to ensure that it does exist first before checking its .url :(
                    if (messagesToCheck.array()[i].attachments.first() != undefined)
                        if (messagesToCheck.array()[i].attachments.first().url != undefined)
                            validURL = messagesToCheck.array()[i].attachments.first().url;

                    if (messagesToCheck.array()[i].embeds[messagesToCheck.array()[i].embeds.length - 1] != undefined)
                        if (messagesToCheck.array()[i].embeds[messagesToCheck.array()[i].embeds.length - 1].url != undefined)   //Check if the .url exists
                            validURL = messagesToCheck.array()[i].embeds[messagesToCheck.array()[i].embeds.length - 1].url;
                        else if (messagesToCheck.array()[i].embeds[messagesToCheck.array()[i].embeds.length - 1].image.url != undefined)    //Check if the .image.url exists
                            validURL = messagesToCheck.array()[i].embeds[messagesToCheck.array()[i].embeds.length - 1].image.url;
                        else
                            console.log("what the fuck");   //If the embed neither had a .url nor a .image.url, panic
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

                    utilitiesModule.checkAndUpdateIndexList(bot, indexListJson);
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