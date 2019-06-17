const Discord = require("discord.js");
const fs = require("fs");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile("./data/fumikaData.json", function (fumikaDataJson) {

        let fumikas = [];
        fs.readdirSync("./graphics/fumikas/").forEach(file => {
            fumikas.push(file);
        });

        let randomIndex = Math.floor(Math.random() * fumikas.length);

        if (!fumikaDataJson[fumikas[randomIndex]]) fumikaDataJson[fumikas[randomIndex]] = { amount: 0 };
        fumikaDataJson[fumikas[randomIndex]].amount++;
        fs.writeFileSync("./data/fumikaData.json", JSON.stringify(fumikaDataJson), function(err) {if (err) return err;});

        let stats = fs.statSync("./graphics/fumikas/" + fumikas[randomIndex]);
        let fileSize = (stats["size"] / 1000000.0).toFixed(2);

        if (fileSize > 8) {
            message.channel.send(`That fuckin image is **${fileSize}mb** big, I physically cannot upload that`);
            return;
        }

        let newEmbed = new Discord.RichEmbed();

        newEmbed.addField(`${fumikas[randomIndex]}`, `Amount unboxed: ${fumikaDataJson[fumikas[randomIndex]].amount}`);
        newEmbed.addField(`Size`, `${fileSize}mb`);

        message.channel.send(newEmbed);
        message.channel.send({ files: ["./graphics/fumikas/" + fumikas[randomIndex] ]});

    });
}

module.exports.help = {
    name: "fumika"
}