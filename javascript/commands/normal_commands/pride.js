const Discord = require("discord.js");
const fs = require("fs");

const genUtils = require("../../command_utilities/general_utilities");

const photoLoc = "./graphics/pride_flags/";
const dataLoc = "./data/general_data/pride_flag_data.json";

//Primary sources for color descriptions:
//University of Northern Colorado https://www.unco.edu/gender-sexuality-resource-center/resources/pride-flags.aspx
//SavvyRed's deviantart post https://www.deviantart.com/savvyred/journal/Pride-Flags-Colors-explained-379547414

module.exports.run = async (bot, message, args) => {

    genUtils.readJSONFile(dataLoc, (prideFlagDataJson) => {

        let flags = [];
        fs.readdir(photoLoc, (err, files) => {

            if (err) console.error(err);

            for (let file in files) {
                flags.push(file);
            }

            let selectedFlag = flags[Math.floor(Math.random() * flags.length)];

            let stats = fs.statSync(`${photoLoc + selectedFlag}`);
            let fileSize = (stats["size"] / 1000000.0).toFixed(2);

            if (fileSize > 8) {
                message.channel.send(`Whoa, sister. That flag is **${fileSize}mb** big, I physically cannot upload that (this message should never appear)`);
                return;
            }

            let fileName = selectedFlag.replace(/\.[^/.]+$/, "");
            let flagObject = prideFlagDataJson[fileName];
            
            if (!flagObject) {
                message.channel.send(`Tell michael that "${fileName}" isn't in the pride flag database`);
                return;
            }

            if (!flagObject.peopleCount) flagObject.peopleCount = 0;

            //Handle peopleCount in various ways
            switch (fileName) {
                case "completely normal photo of ross":
                case "gamer bernie sanders":
                    flagObject.peopleCount = 1;
                    break;

                case "shit eating brain fungus":
                    flagObject.peopleCount = 4;
                    break;
                
                default:
                    flagObject.peopleCount++;
                    break;
            }

            let newEmbed = new Discord.RichEmbed()
                .setTitle(`${fileName}`)
                .addField("Description", flagObject.description)
                .addField("Colors", flagObject.colors)
                .addField(`Number of ${fileName} people`, flagObject.peopleCount)
                .attachFile(`${photoLoc + selectedFlag}`);

            message.channel.send(newEmbed);

            fs.writeFile(dataLoc, JSON.stringify(prideFlagDataJson, null, 4), (err) => { if (err) console.error(err); });

        });

    });

}

module.exports.help = {
    name: "pride"
}