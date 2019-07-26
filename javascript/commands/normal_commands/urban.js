const urban = require("urban-dictionary");

const genUtils = require('../../command_utilities/general_utilities');



module.exports.run = async (bot, message, args) => {

    args = args.join(" ");

    //Random urban call
    if (args.length == 0) {
        urban.random((err, entry) => {
            if (err) console.error(err);
            postEntry(entry);
        });
    }

    //Specific urban call
    else {
        urban.term(args, (err, entries, tags, sounds) => {
            if (err) {
                console.error(err);
                message.channel.send(`No match found for '${args}', ${genUtils.getRandomNameInsult(message)}`);
                return;
            }
            postEntry(entries[0]);
        });
    }

}

module.exports.help = {
    name: "urban"
}



function postEntry(entry) {
    text = `**Word**: ${entry.word} (<${entry.permalink}>)
    \n**Definition**: *${entry.definition}*
    \n**Example**: ${entry.example}`;

    if (text.length >= 2000) text = `The urban dictionary article for '${entry.word}' is too long!\n<${entry.permalink}>`;
    
    message.channel.send(text);

    genUtils.incrementUserDataValue(message.author, "urbanCalls", 1);
}