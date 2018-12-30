const fs = require("fs");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile("./data/indexImageData.json", function (indexListJson) {
        
        if (args.length == 0) {
            message.channel.send("I can't delete nothing, " + utilitiesModule.getRandomNameInsult());
            return;
        }
        if (args.length >= 2) {
            message.channel.send(utilitiesModule.getRandomParameterInsult() + " (Usage: \"!indexDelete imageNameGoesHere\")");
            return;
        }

        let inputIndexName = args[0];
        inputIndexName = inputIndexName.toLowerCase();

        if (inputIndexName == "indexcap") {
            message.channel.send("Don't try to delete indexcap");
        }

        else if (!indexListJson[inputIndexName])
            message.channel.send("There is no image indexed with the name '" + inputIndexName + "' to delete, " + utilitiesModule.getRandomNameInsult());

        else {
            delete indexListJson[inputIndexName];

            utilitiesModule.checkAndUpdateIndexList(bot, indexListJson);
            fs.writeFileSync("./data/indexImageData.json", JSON.stringify(indexListJson));
            message.channel.send("Successfully deleted '" + inputIndexName + "'!");
        }

    });
}

module.exports.help = {
    name: "indexdelete"
}