const Discord = require("discord.js");
const fs = require("fs");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile("./data/shibeData.json", function (shibeDataJson) {

        let shibes = [];
        fs.readdirSync("./shibes/").forEach(file => {
            shibes.push(file);
        });

        let randomIndex = Math.floor(Math.random() * shibes.length);

        if (!shibeDataJson[shibes[randomIndex]]) shibeDataJson[shibes[randomIndex]] = { amount: 0 };
        shibeDataJson[shibes[randomIndex]].amount++;
        fs.writeFileSync("./data/shibeData.json", JSON.stringify(shibeDataJson), function(err) {if (err) return err;});

        let stats = fs.statSync("./shibes/" + shibes[randomIndex]);
        let fileSize = (stats["size"] / 1000000.0).toFixed(2);

        if (fileSize > 8) {
            message.channel.send(`That fuckin image is **${fileSize}mb** big, I physically cannot upload that`);
            return;
        }

        let newEmbed = new Discord.RichEmbed();

        if (shibes[randomIndex] == "komugi shibe 1.jpg") {
            //message.channel.send(`**Holy shit, you unboxed '${shibes[randomIndex]}'!! There was a 1/${shibes.length} chance of that happening!**\n${sizeString}`);
            newEmbed.addField(`Holy shit, a  ${shibes[randomIndex]}!!`, `There was a 1/${shibes.length} chance of that happening!`);
        }
        else {
            newEmbed.addField(`${shibes[randomIndex]}`, `Amount unboxed: ${shibeDataJson[shibes[randomIndex]].amount}`);
            newEmbed.addField(`Size`, `${fileSize}mb`);
            //newEmbed.attachFile("./shibes/" + shibes[randomIndex]);
            //message.channel.send(`**${shibes[randomIndex]}** (Amount unboxed: **${shibeDataJson[shibes[randomIndex]].amount}**)\n${sizeString}`);
        }

        message.channel.send(newEmbed);
        message.channel.send({ files: ["./shibes/" + shibes[randomIndex] ]});

        utilitiesModule.incrementUserDataValue(message.author, "shibeCalls", 1);

    });
}

module.exports.help = {
    name: "shibe"
}