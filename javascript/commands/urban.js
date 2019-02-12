const utilitiesModule = require('../utilities');
const urban = require("urban-dictionary");

module.exports.run = async (bot, message, args) => {
    args = args.join(" ");
    if (args.length == 0) {
        urban.random((error, entry) => {
            if (error) {
                message.channel.send("Something went wrong, " + utilitiesModule.getRandomNameInsult());
            }
            else {
                text = "**Word**: " + entry.word +
                    "\n\n**Definition**: *" + entry.definition + "*" +
                    "\n\n**Example**: " + entry.example +
                    "\n\n<" + entry.permalink + ">";
                if (text.length >= 2000) message.channel.send("That urban dictionary article is too long!\n<" + entry.permalink + ">");
                else message.channel.send(text);
            }
        });
    }
    else {
        urban.term(args, (error, entries, tags, sounds) => {
            if (error) {
                message.channel.send("No match found for '" + args + "', " + utilitiesModule.getRandomNameInsult());
            }
            else {
                text = "**Word**: " + entries[0].word +
                    "\n\n**Definition**: *" + entries[0].definition + "*" +
                    "\n\n**Example**: " + entries[0].example +
                    "\n\n<" + entries[0].permalink + ">";
                if (text.length >= 2000) message.channel.send("That urban dictionary article is too long!\n<" + entries[0].permalink + ">");
                else message.channel.send(text);
            }
        });
    }
    utilitiesModule.incrementUserDataValue(message.author, "urbanCalls", 1);
}

module.exports.help = {
    name: "urban"
}