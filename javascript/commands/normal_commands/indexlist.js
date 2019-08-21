const dbUtils = require(`../../database_stuff/index_image_database_handler`);
const genUtils = require('../../command_utilities/general_utilities');
const embed_list_handler = require(`../../command_utilities/embed_list_handler`);



module.exports.run = async (bot, message, args) => {

    if (args.length > 1) {
        message.channel.send(`Too many parameters, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    let indexEntries = dbUtils.getAllIndices(message.guild);

    if (indexEntries.length == 0) {
        message.channel.send(`This server doesn't have any indices yet, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }

    

    if (args.length == 0) {
        let newEmbedList = new embed_list_handler.EmbedList(message, indexEntries, `Indices (Total: ${indexEntries.length})`, "index_name", 25);
        newEmbedList.createMessage();
    }
    else if (args.length == 1) {
        let newEmbedList = new embed_list_handler.EmbedList(message, indexEntries, `Indices (Total: ${indexEntries.length})`, "index_name", 25);

        let startEntry = genUtils.verifyIntVal(parseInt(args[0]), 1, indexEntries.length, "Start entry", message);
        if (!startEntry) return;

        newEmbedList.createMessage(startEntry);
    }

}

module.exports.help = {
    name: "indexlist",
    description: "Displays a list of the server's indices, starting on the page of the provided startEntry if provided",
    usage: "!indexlist [startEntry]",
    example: "!indexlist 100",
    funFacts: [
        `This command was a long time coming. I put it off until I figured out how to do the embedded-list thing.`
    ]
}