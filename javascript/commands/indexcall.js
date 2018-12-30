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

            let indexCapIndex = nameList.indexOf("indexCap");
            if (indexCapIndex != -1) {  //indexCapIndex would only be -1 if the indexOf() call above didn't find anything
                nameList.splice(indexCapIndex, 1);
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
                return;
            }
        }

        //If too many arguments were supplied, insult the user
        if (args.length >= 2) {
            message.channel.send(utilitiesModule.getRandomParameterInsult() + " (Usage: \"!indexCall imageNameGoesHere\")");
            return;
        }

        let inputIndexCall = args[0];
        inputIndexCall = inputIndexCall.toLowerCase();

        if (inputIndexCall == "indexcap") {
            message.channel.send("Don't try to call indexcap");
        }
        else if (!indexDataJson[inputIndexCall]) {
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

        utilitiesModule.checkAndUpdateIndexList(bot, indexDataJson);

    });
}

module.exports.help = {
    name: "indexcall"
}