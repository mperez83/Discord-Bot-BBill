const Discord = require("discord.js");
const fs = require("fs");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile("./data/hamData.json", function (hamDataJson) {

        let hams = [];
        fs.readdirSync("./hams/").forEach(file => {
            hams.push(file);
        });

        let randomIndex = Math.floor(Math.random() * hams.length);

        if (!hamDataJson[hams[randomIndex]]) hamDataJson[hams[randomIndex]] = { amount: 0 };
        hamDataJson[hams[randomIndex]].amount++;
        fs.writeFileSync("./data/hamData.json", JSON.stringify(hamDataJson), function(err) {if (err) return err;});

        let stats = fs.statSync("./hams/" + hams[randomIndex]);
        let fileSize = (stats["size"] / 1000000.0).toFixed(2);

        if (fileSize > 8) {
            message.channel.send(`That fuckin image is **${fileSize}mb** big, I physically cannot upload that`);
            return;
        }

        let newEmbed = new Discord.RichEmbed();

        newEmbed.addField(`${hams[randomIndex]}`, `Amount unboxed: ${hamDataJson[hams[randomIndex]].amount}`);
        newEmbed.addField(`Size`, `${fileSize}mb`);

        message.channel.send(newEmbed);
        message.channel.send({ files: ["./hams/" + hams[randomIndex] ]});

        utilitiesModule.incrementUserDataValue(message.author, "shibeCalls", 1);

    });
}

module.exports.help = {
    name: "ham"
}