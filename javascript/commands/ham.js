const Discord = require("discord.js");
const fs = require("fs");
const utilitiesModule = require('../utilities');

const photoLoc = "./graphics/hams/";
const dataLoc = "./data/image_data/hamData.json";



module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile(dataLoc, function (hamDataJson) {

        let hams = [];
        fs.readdirSync(photoLoc).forEach(file => {
            hams.push(file);
        });

        let selectedHam = hams[Math.floor(Math.random() * hams.length)]
        let hamJsonObj = hamDataJson[selectedHam];

        //Setting json stuff
        if (!hamJsonObj) hamJsonObj = { amount: 0 };
        hamJsonObj.amount++;

        hamDataJson[selectedHam] = hamJsonObj;  //see shibe.js to know why I'm doing this
        fs.writeFileSync(dataLoc, JSON.stringify(hamDataJson, null, 4), function(err) {if (err) return err;});

        let stats = fs.statSync(`${photoLoc + selectedHam}`);
        let fileSize = (stats["size"] / 1000000.0).toFixed(2);

        if (fileSize > 8) {
            message.channel.send(`That fuckin image is **${fileSize}mb** big, I physically cannot upload that`);
            return;
        }

        let newEmbed = new Discord.RichEmbed();

        newEmbed.addField(`${selectedHam}`, `Amount unboxed: ${hamJsonObj.amount}`);
        newEmbed.addField(`Size`, `${fileSize}mb`);

        message.channel.send(newEmbed);
        message.channel.send({ files: [`${photoLoc + selectedHam}`] });

    });
}

module.exports.help = {
    name: "ham"
}