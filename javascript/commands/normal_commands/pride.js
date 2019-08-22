const Discord = require("discord.js");
const fs = require("fs");

const dbUtils = require(`../../database_stuff/misc_database_handler`);

const photoLoc = "./graphics/pride_flags/";

//Primary sources for color descriptions:
//University of Northern Colorado https://www.unco.edu/gender-sexuality-resource-center/resources/pride-flags.aspx
//SavvyRed's deviantart post https://www.deviantart.com/savvyred/journal/Pride-Flags-Colors-explained-379547414

module.exports.run = async (bot, message, args) => {

    let flags = [];
    fs.readdir(photoLoc, (err, files) => {

        if (err) console.error(err);

        files.forEach((file) => {
            flags.push(file);
        });

        let selectedFlag = flags[Math.floor(Math.random() * flags.length)];

        let stats = fs.statSync(`${photoLoc + selectedFlag}`);
        let fileSize = (stats["size"] / 1000000.0).toFixed(2);

        if (fileSize > 8) {
            message.channel.send(`Whoa, sister. That flag is **${fileSize}mb** big, I physically cannot upload that (this message should never appear)`);
            return;
        }

        let fileName = selectedFlag.replace(/\.[^/.]+$/, "");
        let flagDatabaseEntry = dbUtils.getPrideData(fileName);
        
        if (!flagDatabaseEntry) {
            message.channel.send(`Tell michael that "${fileName}" has some corrupt data`);
            return;
        }

        if (fileName != `catgirl who spilled her orange juice` && fileName != `completely normal photo of ross` && fileName != `gamer bernie sanders` && fileName != `shit eating brain fungus`) {
            flagDatabaseEntry.people_count++;
        }

        let newEmbed = new Discord.RichEmbed()
            .setTitle(`${flagDatabaseEntry.flag_name}`)
            .addField("Description", flagDatabaseEntry.description)
            .addField("Colors", flagDatabaseEntry.colors)
            .addField(`Amount of ${flagDatabaseEntry.flag_name} people`, flagDatabaseEntry.people_count)
            .attachFile(`${photoLoc + selectedFlag}`);

        message.channel.send(newEmbed);

        if (fileName != `catgirl who spilled her orange juice` && fileName != `completely normal photo of ross` && fileName != `gamer bernie sanders` && fileName != `shit eating brain fungus`) {
            dbUtils.setPrideData(flagDatabaseEntry);
        }

    });

}

module.exports.help = {
    name: "pride",
    description: "Posts a random pride flag, as well as some information about it",
    usage: "!pride",
    example: "!pride",
    funFacts: [
        `This command was initially made to help me commit all the various gender, romantic, and sexual identities to memory. Generating the list helped \
        tremendously with that, as well as the subsequent usage of the command.`,
        `Making !pride was one of the few times where I spent a disproportionately large amount of time doing research for the command rather than coding.`
    ]
}