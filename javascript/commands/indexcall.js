const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile("./data/indexImageData.json", function (indexDataJson) {
        
        //If no arg was supplied, display a random image in the indexlist
        if (args.length == 0) {
            let nameList = [];

            for (indexEntry in indexDataJson) {
                if (indexDataJson.hasOwnProperty(indexEntry)) {
                    nameList.push(indexEntry);
                }
            }

            if (nameList.length == 0) {
                message.channel.send("There are no indices in the list yet, " + utilitiesModule.getRandomNameInsult());
                return;
            }
            else {
                let inputIndexCall = nameList[Math.floor(Math.random() * nameList.length)];
                message.channel.send(`**${inputIndexCall}**`);
                message.channel.send({
                    embed: {
                        image: {
                            url: indexDataJson[inputIndexCall].url
                        }
                    }
                });
                utilitiesModule.incrementUserDataValue(message.author, "indexCalls", 1);
                return;
            }
        }

        let inputIndexCall = args.join(" ");
        //inputIndexCall = inputIndexCall.toLowerCase();

        if (!indexDataJson[inputIndexCall]) {
            message.channel.send("There is no image indexed with the name '" + inputIndexCall + "', " + utilitiesModule.getRandomNameInsult());
        }
        else {
            //message.channel.send({file: indexImageData[argName].url});//probably don't use this (it creates a new file in discord everytime someone calls something)
            //message.channel.send(indexImageData[argName].url);        //Maybe use this (posts a URL to the picture, which by default posts the picture)
            message.channel.send({                                      //Totally use this (embeds the picture into a beautiful embed box)
                embed: {
                    image: {
                        url: indexDataJson[inputIndexCall].url
                    }
                }
            });
        }

        utilitiesModule.incrementUserDataValue(message.author, "indexCalls", 1);

    });
}

module.exports.help = {
    name: "indexcall"
}