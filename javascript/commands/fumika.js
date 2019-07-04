const Discord = require("discord.js");
const fs = require("fs");
const utilitiesModule = require('../utilities');

const photoLoc = "./graphics/fumikas/";
const dataLoc = "./data/image_data/fumikaData.json";



module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile(dataLoc, function (fumikaDataJson) {

        let fumikas = [];
        fs.readdirSync(photoLoc).forEach(file => {
            fumikas.push(file);
        });

        let selectedFumika = fumikas[Math.floor(Math.random() * fumikas.length)];
        let fumikaJsonObj = fumikaDataJson[selectedFumika];

        //Setting json stuff
        if (!fumikaJsonObj) fumikaJsonObj = { amount: 0 };
        fumikaJsonObj.amount++;

        fumikaDataJson[selectedFumika] = fumikaJsonObj; //see shibe.js to know why I'm doing this
        fs.writeFileSync(dataLoc, JSON.stringify(fumikaDataJson), function(err) {if (err) return err;});

        let stats = fs.statSync(`${photoLoc + selectedFumika}`);
        let fileSize = (stats["size"] / 1000000.0).toFixed(2);

        if (fileSize > 8) {
            message.channel.send(`That fuckin image is **${fileSize}mb** big, I physically cannot upload that`);
            return;
        }

        let newEmbed = new Discord.RichEmbed();

        newEmbed.addField(`${selectedFumika}`, `Amount unboxed: ${fumikaJsonObj.amount}`);
        newEmbed.addField(`Size`, `${fileSize}mb`);

        message.channel.send(newEmbed);
        message.channel.send({ files: [`${photoLoc + selectedFumika}`] });

    });
}

module.exports.help = {
    name: "fumika"
}