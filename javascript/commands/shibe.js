const Discord = require("discord.js");
const fs = require("fs");
const utilitiesModule = require('../utilities');



module.exports.run = async (bot, message, args) => {

    utilitiesModule.readJSONFile("./data/shibeData.json", function (shibeDataJson) {

        let shibes = [];
        fs.readdirSync("./graphics/shibes/").forEach(file => {
            shibes.push(file);
        });

        let randomIndex = Math.floor(Math.random() * shibes.length);

        if (!shibeDataJson[shibes[randomIndex]]) shibeDataJson[shibes[randomIndex]] = { amount: 0 };
        shibeDataJson[shibes[randomIndex]].amount++;

        if (!shibeDataJson[shibes[randomIndex]].rarity) shibeDataJson[shibes[randomIndex]].rarity = "Not set yet";

        fs.writeFileSync("./data/shibeData.json", JSON.stringify(shibeDataJson), function(err) {if (err) return err;});

        let stats = fs.statSync("./graphics/shibes/" + shibes[randomIndex]);
        let fileSize = (stats["size"] / 1000000.0).toFixed(2);

        if (fileSize > 8) {
            message.channel.send(`That fuckin image is **${fileSize}mb** big, I physically cannot upload that`);
            return;
        }

        let newEmbed = new Discord.RichEmbed();

        if (shibes[randomIndex] == "komugi shibe 1.jpg") {
            //message.channel.send(`**Holy shit, you unboxed '${shibes[randomIndex]}'!! There was a 1/${shibes.length} chance of that happening!**\n${sizeString}`);
            newEmbed.addField(`Holy shit, a  ${shibes[randomIndex]}!!`, `There was a 1/${shibes.length} chance of that happening!`);
            newEmbed.setColor("#ff0000");
        }
        else {
            newEmbed.addField(`${shibes[randomIndex]}`, `Amount unboxed: ${shibeDataJson[shibes[randomIndex]].amount}`);
            newEmbed.addField(`Rarity`, `${shibeDataJson[shibes[randomIndex]].rarity}`);
            newEmbed.addField(`Size`, `${fileSize}mb`);

            switch(shibeDataJson[shibes[randomIndex]].rarity) {
                case "Common":
                    newEmbed.setColor("#bcbcbc");
                    break;

                case "Uncommon":
                    newEmbed.setColor("#5bff7f");
                    break;
                
                case "Rare":
                    newEmbed.setColor("#5468ff");
                    break;

                case "Epic":
                    newEmbed.setColor("#c62bff");
                    break;
                
                case "Legendary":
                    newEmbed.setColor("#f2ff00");
                    break;
            }
        }

        message.channel.send(newEmbed);
        message.channel.send({ files: ["./graphics/shibes/" + shibes[randomIndex] ]});

        utilitiesModule.incrementUserDataValue(message.author, "shibeCalls", 1);

        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
        collector.on('collect', message => {

            msg = message.content.toLowerCase();
            if (msg == "common" || msg == "uncommon" || msg == "rare" || msg == "epic" || msg == "legendary") {

                switch (msg) {
                    case "common":
                        shibeDataJson[shibes[randomIndex]].rarity = "Common";
                        break;

                    case "uncommon":
                        shibeDataJson[shibes[randomIndex]].rarity = "Uncommon";
                        break;
                    
                    case "rare":
                        shibeDataJson[shibes[randomIndex]].rarity = "Rare";
                        break;

                    case "epic":
                        shibeDataJson[shibes[randomIndex]].rarity = "Epic";
                        break;
                    
                    case "legendary":
                        shibeDataJson[shibes[randomIndex]].rarity = "Legendary";
                        break;
                }

                fs.writeFileSync("./data/shibeData.json", JSON.stringify(shibeDataJson), function(err) {if (err) return err;});
                message.react("✅");
                collector.stop();

            }

        });
    });
}

module.exports.help = {
    name: "shibe"
}