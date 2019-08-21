const Discord = require("discord.js");
const urlExists = require(`url-exists`);

const dbUtils = require(`../../database_stuff/index_image_database_handler`);
const genUtils = require("../../command_utilities/general_utilities");



module.exports.run = async (bot, message, args) => {

    if (args.length > 0) {
        message.channel.send(`Too many parameters, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    let validServerID = dbUtils.getValidServer();
    if (!validServerID) {
        message.channel.send(`There are no valid servers. ${genUtils.getRandomNameInsult(message)}`);
        return;
    }

    //console.log(validServerID);
    //console.log(bot.guilds.get(validServerID));
    //console.log(bot.guilds.find(val => val.id == validServerID))
    let selectedServer = bot.guilds.find(val => val.id == validServerID);
    let indexEntry = dbUtils.getRandomIndex(selectedServer);

    if (!indexEntry) {
        message.channel.send(`The server I pulled from didn't have any indices so I'm making it as an invalid server >:(`);
        dbUtils.invalidateServer(selectedServer);
        return;
    }

    urlExists(indexEntry.url, (err, exists) => {
        if (err) console.error(err);

        //If the index was broken, delete it
        if (!exists) {
            message.channel.send(`I accidentally pulled a broken index from a server. I'm not gonna delete it out of respect (it was called **${indexEntry.index_name}**)`);
            return;
        }

        //Otherwise, post it
        else {
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
    });

}

module.exports.help = {
    name: "eindexcall",
    description: "Posts a random index from any server with indices",
    usage: "!eindexcall",
    example: "!eindexcall",
    funFacts: [
        "This is a potentially dangerous command, since any server is able to index anything."
    ]
}