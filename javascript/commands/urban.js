const utilitiesModule = require('../utilities');
const urban = require("urban-dictionary");

module.exports.run = async (bot, message, args) => {
    args = args.join(" ");

    //Random urban call
    if (args.length == 0) {
        urban.random((error, entry) => {
            if (error) {
                message.channel.send(`Something went wrong, ${utilitiesModule.getRandomNameInsult}`);
            }
            else {
                text = `**Word**: ${entry.word} (<${entry.permalink}>)
                \n**Definition**: *${entry.definition}*
                \n**Example**: ${entry.example}`;

                if (text.length >= 2000) message.channel.send(`The urban dictionary article for '${entry.word}' is too long!\n<${entry.permalink}>`);
                else message.channel.send(text);
            }
        });
    }

    //Specific urban call
    else {
        urban.term(args, (error, entries, tags, sounds) => {
            if (error) {
                message.channel.send(`No match found for '${args}', ${utilitiesModule.getRandomNameInsult()}`);
            }
            else {
                text = `**Word**: ${entries[0].word} (<${entries[0].permalink}>)
                \n**Definition**: *${entries[0].definition}*
                \n**Example**: ${entries[0].example}`;
                
                if (text.length >= 2000) message.channel.send(`The urban dictionary article for '${entries[0].word}' is too long!\n<${entries[0].permalink}>`);
                else message.channel.send(text);
            }
        });
    }

    utilitiesModule.incrementUserDataValue(message.author, "urbanCalls", 1);
}

module.exports.help = {
    name: "urban"
}