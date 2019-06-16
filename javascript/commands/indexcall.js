const Discord = require("discord.js");
const fs = require("fs");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile("./data/indexImageData.json", function (indexDataJson) {

        let inputIndexCall;
        let randomCall = false;
        
        //If no arg was supplied, choose a random indice name to set as inputIndexCall (after checking that there are indices in the list)
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
                inputIndexCall = nameList[Math.floor(Math.random() * nameList.length)];
                randomCall = true;
            }
        }

        //If an arg was supplied, set inputIndexCall as the args (after checking to make sure it exists)
        else {
            inputIndexCall = args.join(" ");

            if (!indexDataJson[inputIndexCall]) {
                message.channel.send("There is no image indexed with the name '" + inputIndexCall + "', " + utilitiesModule.getRandomNameInsult());
                return;
            }
        }

        //Remove indices that don't have url properties
        if (!indexDataJson[inputIndexCall].url) {
            message.channel.send(`"${inputIndexCall}" doesn't even have a url property!!!!!!! im deleting it`);
            delete indexDataJson[inputIndexCall];
            fs.writeFileSync("./data/indexImageData.json", JSON.stringify(indexDataJson));
            return;
        }

        //Remove indices that don't have valid urls (don't contain .jpeg, .jpg, .gif, .png)
        if (indexDataJson[inputIndexCall].url.match(/\.(jpeg|jpg|gif|png)$/) == null) {
            message.channel.send(`"${inputIndexCall}" isn't even valid!!!!!!! im deleting it`);
            delete indexDataJson[inputIndexCall];
            fs.writeFileSync("./data/indexImageData.json", JSON.stringify(indexDataJson));
            return;
        }



        //Actually compose the message
        let newEmbed = new Discord.RichEmbed();

        if (!indexDataJson[inputIndexCall].directCalls) indexDataJson[inputIndexCall].directCalls = 0;
        if (!randomCall) indexDataJson[inputIndexCall].directCalls++;

        newEmbed.addField(`${inputIndexCall}`, `Direct Calls: ${indexDataJson[inputIndexCall].directCalls}`);
        newEmbed.setImage(indexDataJson[inputIndexCall].url);

        message.channel.send(newEmbed);

        //This is to update the directCalls property
        fs.writeFileSync("./data/indexImageData.json", JSON.stringify(indexDataJson));

        utilitiesModule.incrementUserDataValue(message.author, "indexCalls", 1);
        return;

    });
}

module.exports.help = {
    name: "indexcall"
}