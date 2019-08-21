const Discord = require("discord.js");

const dbUtils = require(`../../database_stuff/index_image_database_handler`);
const genUtils = require("../../command_utilities/general_utilities");



module.exports.run = async (bot, message, args) => {

    if (message.channel.type == "dm") {
        message.channel.send(`You can't use this in a dm, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }

    if (args.length == 0) {

        let indexEntry = dbUtils.getRandomIndex(message.guild);

        if (!indexEntry) {
            message.channel.send(`This server doesn't have any indices yet, ${genUtils.getRandomNameInsult(message)}`);
            return;
        }

        indexEntry.accidental_calls++;

        let newEmbed = new Discord.RichEmbed()
            .setTitle(indexEntry.index_name)
            .setURL(indexEntry.url)
            .addField(`Direct Calls`, indexEntry.direct_calls, true)
            .addField(`Accidental Calls`, indexEntry.accidental_calls, true)
            .setImage(indexEntry.url);
        message.channel.send(newEmbed);

        dbUtils.updateImageIndexData(message.guild, indexEntry);

    }
    else {

        let inputIndexCall = args.join(" ");
        let indexEntry = dbUtils.getIndexedImageByName(message.guild, inputIndexCall);

        if (!indexEntry.index_name) {
            message.channel.send(`There is no image indexed with the name "${inputIndexCall}", ${genUtils.getRandomNameInsult(message)}`);
            return;
        }

        indexEntry.direct_calls++;

        let newEmbed = new Discord.RichEmbed()
            .setTitle(indexEntry.index_name)
            .setURL(indexEntry.url)
            .addField(`Direct Calls`, indexEntry.direct_calls, true)
            .addField(`Accidental Calls`, indexEntry.accidental_calls, true)
            .setImage(indexEntry.url);
        message.channel.send(newEmbed);

        dbUtils.updateImageIndexData(message.guild, indexEntry);

    }

}

module.exports.help = {
    name: "indexcall",
    description: "Posts the index under the specified name if one exists, or a random index if no name is provided",
    usage: "!indexcall [name]",
    example: "!indexcall when you get the victory royale",
    funFacts: [
        "One popular pastime to engage in is to do a random !indexcall, and immediately do a !distort right after.",
        "Rather than saving the indexed image to disk and posting the image upon its indexcall, Big Bill saves the URL of the indexed image \
        and posts it as a discord embed. This makes it much faster to post and less wasteful towards Discord's servers, but if the source URL \
        is ever broken (for example, by deleting the original message), the index will be considered broken, and Big Bill will delete it."
    ]
}