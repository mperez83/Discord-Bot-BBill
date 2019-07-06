const Discord = require("discord.js");
const fs = require("fs");
const utilitiesModule = require("../utilities");

const photoLoc = "./graphics/shibes/";
const dataLoc = "./data/image_data/shibeData.json";



module.exports.run = async (bot, message, args) => {

    utilitiesModule.readJSONFile(dataLoc, function (shibeDataJson) {

        let shibes = [];
        fs.readdirSync(photoLoc).forEach(file => {
            shibes.push(file);
        });

        let selectedShibe = shibes[Math.floor(Math.random() * shibes.length)];
        let shibeJsonObj = shibeDataJson[selectedShibe];

        //Setting json stuff
        if (!shibeJsonObj) shibeJsonObj = { amount: 0 };
        shibeJsonObj.amount++;
        if (!shibeJsonObj.rarity) shibeJsonObj.rarity = "Not set yet";
        
        //Javascript can't do pass by reference, so when I set shibeJsonObj = shibeDataJson[selectedShibe], it gained all of the values of shibeDataJson[selectedShibe],
        //but changing the values in shibeJsonObj does not affect shibeDataJson[selectedShibe]. This is a shame because shibeJsonObj is much more readable (particularly
        //because it's used a lot further on), so in order to maintain that clean aspect, I have to manually set shibeDataJson[selectedShibe] = shibeJsonObj, which in
        //a sense lets the original json file know that its been updated.
        shibeDataJson[selectedShibe] = shibeJsonObj;
        fs.writeFileSync(dataLoc, JSON.stringify(shibeDataJson, null, 4), function(err) {if (err) return err;});

        let stats = fs.statSync(`${photoLoc + selectedShibe}`);
        let fileSize = (stats["size"] / 1000000.0).toFixed(2);

        if (fileSize > 8) {
            message.channel.send(`That fuckin image is **${fileSize}mb** big, I physically cannot upload that`);
            return;
        }

        let newEmbed = new Discord.RichEmbed();

        if (selectedShibe == "komugi shibe 1.jpg") {
            //message.channel.send(`**Holy shit, you unboxed '${selectedShibe}'!! There was a 1/${shibes.length} chance of that happening!**\n${sizeString}`);
            newEmbed.addField(`Holy shit, a ${selectedShibe}!!`, `There was a 1/${shibes.length} chance of that happening!`);
            newEmbed.setColor("#ff0000");
        }
        else {
            newEmbed.addField(`${selectedShibe}`, `Amount unboxed: ${shibeJsonObj.amount}`);
            newEmbed.addField(`Rarity`, `${shibeJsonObj.rarity}`);
            newEmbed.addField(`Size`, `${fileSize}mb`);

            switch(shibeJsonObj.rarity) {
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
        message.channel.send({ files: [`${photoLoc + selectedShibe}`] })
            .then(function(msg) {
                const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 15000 });
                collector.on('collect', message => {

                    msg = message.content.toLowerCase();
                    if (msg == "common" || msg == "uncommon" || msg == "rare" || msg == "epic" || msg == "legendary") {

                        switch (msg) {
                            case "common":
                                shibeJsonObj.rarity = "Common";
                                break;

                            case "uncommon":
                                shibeJsonObj.rarity = "Uncommon";
                                break;
                            
                            case "rare":
                                shibeJsonObj.rarity = "Rare";
                                break;

                            case "epic":
                                shibeJsonObj.rarity = "Epic";
                                break;
                            
                            case "legendary":
                                shibeJsonObj.rarity = "Legendary";
                                break;
                        }
                        
                        shibeDataJson[selectedShibe] = shibeJsonObj;
                        fs.writeFileSync(dataLoc, JSON.stringify(shibeDataJson, null, 4), function(err) {if (err) return err;});

                        message.react("✅");
                        utilitiesModule.incrementUserDataValue(message.author, "Billie-Bucks", 1);
                        collector.stop();

                    }

                });
            })
            .catch(console.error);

        utilitiesModule.incrementUserDataValue(message.author, "shibeCalls", 1);
    });
}

module.exports.help = {
    name: "shibe"
}