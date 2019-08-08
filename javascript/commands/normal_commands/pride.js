const Discord = require("discord.js");
const fs = require("fs");

const photoLoc = "./graphics/pride_flags/";
const prideFlagData = require("../../../data/static_command_data/pride_flag_data.json");

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
        let flagObject = prideFlagData[fileName];
        
        if (!flagObject) {
            message.channel.send(`Tell michael that "${fileName}" isn't in the pride flag database`);
            return;
        }

        let newEmbed = new Discord.RichEmbed()
            .setTitle(`${fileName}`)
            .addField("Description", flagObject.description)
            .addField("Colors", flagObject.colors)
            .attachFile(`${photoLoc + selectedFlag}`);

        message.channel.send(newEmbed);

    });

}

module.exports.help = {
    name: "pride",
    description: "Posts a random pride flag, as well as some information about it",
    usage: "!pride",
    example: "!pride",
    funFacts: [
        "This command was initially made to help me commit all the various gender, romantic, and sexual identities to memory. Generating the list helped \
        tremendously with that, as well as the subsequent usage of the command.",
        "The amount of times each flag was brought up used to be logged as \"Amount of <blank> people\", but that has since been removed.",
        "Making !pride was one of the few times where I spent a disproportionately large amount of time doing research for the command rather than coding."
    ]
}