const fs = require("fs");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile("./data/indexImageData.json", function (indexListJson) {
        
        if (args.length == 0) {
            message.channel.send("I can't delete nothing, " + utilitiesModule.getRandomNameInsult());
            return;
        }

        let inputIndexName = args.join(" ");
        //inputIndexName = inputIndexName.toLowerCase();

        if (!indexListJson[inputIndexName])
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