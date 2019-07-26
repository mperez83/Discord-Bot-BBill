const fs = require("fs");

const genUtils = require('../javascript/command_utilities/general_utilities');



module.exports.run = async (bot, message, args) => {

    genUtils.readJSONFile("./data/indexImageData.json", (indexListJson) => {
        
        if (args.length == 0) {
            message.channel.send("I can't delete nothing, " + genUtils.getRandomNameInsult());
            return;
        }

        

        let inputIndexName = args.join(" ");

        if (!indexListJson[inputIndexName])
            message.channel.send("There is no image indexed with the name '" + inputIndexName + "' to delete, " + genUtils.getRandomNameInsult());

        else {
            delete indexListJson[inputIndexName];

            fs.writeFile("./data/indexImageData.json", JSON.stringify(indexListJson), (err) => {
                if (err) console.error(err);
                else {
                    message.channel.send("Successfully deleted '" + inputIndexName + "'!");
                }
            });
        }

    });

}

module.exports.help = {
    name: "indexdelete"
}