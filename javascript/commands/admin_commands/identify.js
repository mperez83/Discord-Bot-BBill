const genUtils = require("../../command_utilities/general_utilities");
const dataLoc = "./data/general_data/index_image_data.json";



module.exports.run = async (bot, message, args) => {

    //if this message wasn't sent by ME, return
    if (message.author.id != "205106238697111552") {
        message.channel.send(`unauthorized access, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }

    genUtils.readJSONFile(dataLoc, function (indexDataJson) {
        
        if (args.length == 0) {
            message.channel.send(`I need an index name in order to identify who did it, ${genUtils.getRandomNameInsult(message)}`);
            return;
        }

        let inputIndexCall = args.join(" ");

        if (!indexDataJson[inputIndexCall]) {
            message.channel.send(`There is no image indexed with the name "${inputIndexCall}", ${genUtils.getRandomNameInsult(message)}`);
            return;
        }
        else if (!indexDataJson[inputIndexCall].culprit) {
            message.channel.send(`Culprit: Unknown :(`);
            return;
        }
        else {
            message.channel.send(`Culprit: ${indexDataJson[inputIndexCall].culprit}`);
            return;
        }

    });

}

module.exports.help = {
    name: "identify"
}