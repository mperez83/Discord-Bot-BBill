const urban = require("urban-dictionary");

const genUtils = require('../../command_utilities/general_utilities');



module.exports.run = async (bot, message, args) => {

    args = args.join(" ");

    //Random urban call
    if (args.length == 0) {
        urban.random((err, entry) => {
            if (err) {
                console.error(err);
                message.channel.send(`How did you fuck up a random call, ${genUtils.getRandomNameInsult(message)}`);
                return;
            }
            postEntry(message, entry);
        });
    }

    //Specific urban call
    else {
        urban.term(args, (err, entries, tags, sounds) => {
            if (err) {
                //console.error(err);
                message.channel.send(`No match found for '${args}', ${genUtils.getRandomNameInsult(message)}`);
                return;
            }
            postEntry(message, entries[0]);
        });
    }

}

module.exports.help = {
    name: "urban",
    description: "Searches urban dictionary for the specified input and posts the article about it, or posts a random urban dictionary article if no input is provided",
    usage: "!urban [input]",
    example: "!urban (800)-588-2300",
    funFacts: [
        `Sometimes, users engage in the activity of doing random urban calls in order to find a new nickname to use.`,
        `There's a bizarre amount of entries that are just... numbers, like they're just random numbers and they have entries attached to them`
    ]
}



function postEntry(message, entry) {
    text = `**Word**: ${entry.word} (<${entry.permalink}>)
    \n**Definition**: *${entry.definition}*
    \n**Example**: ${entry.example}`;

    if (text.length >= 2000) text = `The urban dictionary article for '${entry.word}' is too long!\n<${entry.permalink}>`;
    
    message.channel.send(text);
}