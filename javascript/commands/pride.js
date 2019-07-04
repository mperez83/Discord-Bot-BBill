const Discord = require("discord.js");
const fs = require("fs");
const utilitiesModule = require("../utilities");

//Primary sources for color descriptions:
//University of Northern Colorado https://www.unco.edu/gender-sexuality-resource-center/resources/pride-flags.aspx
//SavvyRed's deviantart post https://www.deviantart.com/savvyred/journal/Pride-Flags-Colors-explained-379547414

module.exports.run = async (bot, message, args) => {

    utilitiesModule.readJSONFile("./data/general_data/prideFlagData.json", function (prideFlagDataJson) {

        let flags = [];
        fs.readdirSync("./graphics/pride flags/").forEach(file => {
            flags.push(file);
        });

        let randomIndex = Math.floor(Math.random() * flags.length);

        let selectedFlag = `./graphics/pride flags/${flags[randomIndex]}`;
        let stats = fs.statSync(selectedFlag);
        let fileSize = (stats["size"] / 1000000.0).toFixed(2);

        if (fileSize > 8) {
            message.channel.send(`Whoa, sister. That flag is **${fileSize}mb** big, I physically cannot upload that (this message should never appear)`);
            return;
        }

        let fileName = flags[randomIndex].replace(/\.[^/.]+$/, "");

        let flagObject = prideFlagDataJson[fileName];
        if (!flagObject.peopleCount) flagObject.peopleCount = 0;
        flagObject.peopleCount++;

        let newEmbed = new Discord.RichEmbed()
            .setTitle(`${fileName}`)
            .addField("Description", flagObject.description)
            .addField("Colors", flagObject.colors)
            .addField(`Number of ${fileName} people`, flagObject.peopleCount)
            .attachFile(selectedFlag);

        message.channel.send(newEmbed);

        fs.writeFileSync("./data/general_data/prideFlagData.json", JSON.stringify(prideFlagDataJson));

    });

}

module.exports.help = {
    name: "pride"
}