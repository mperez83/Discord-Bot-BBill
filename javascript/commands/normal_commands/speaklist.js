const fs = require("fs");

const genUtils = require('../../command_utilities/general_utilities');
const embed_list_handler = require(`../../command_utilities/embed_list_handler`);



module.exports.run = async (bot, message, args) => {

    if (args.length > 1) {
        message.channel.send(`Too many parameters, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    let audioFiles = [];

    fs.readdir("./audio/", (err, files) => {

        if (err) console.error(err);

        //Get the audio files
        files.forEach((file) => {
            let croppedFile = file.slice(0, -4);
            audioFiles.push(croppedFile);
        });

        if (audioFiles.length == 0) {
            message.channel.send(`There are no audio files to display yet, ${genUtils.getRandomNameInsult(message)}`);
            return;
        }


        //Generate the list
        let newEmbedList = new embed_list_handler.EmbedList(message, audioFiles, `Audio Files (Total: ${audioFiles.length})`, 10);
    
        //If no argument was supplied, start the list off on the first page
        if (args.length == 0) {
            newEmbedList.createMessage();
        }
    
        //Else, start the list off on the page with the supplied entry number
        else if (args.length == 1) {
            let startEntry = genUtils.verifyIntVal(parseInt(args[0]), 1, audioFiles.length, "Start entry", message);
            if (!startEntry) return;
    
            newEmbedList.createMessage(startEntry);
        }

    });

}

module.exports.help = {
    name: "speaklist",
    description: "Displays a list of the things big bill can say, starting on the page of the provided startEntry (if provided)",
    usage: "!speaklist [startEntry]",
    example: "!speaklist 10",
    funFacts: [
        `Given the infrastructure was already setup with !indexlist, this command was easy to implement!`
    ]
}