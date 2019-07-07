const Discord = require("discord.js");
const fs = require("fs");

const utilitiesModule = require("./utilities");
const config = require("../data/general_data/config.json");



module.exports.unboxImage = function(message) {

    let command = message.content.split(/\s+/g)[0];
    command = command.slice(config.prefix.length);

    let photoLoc = `./graphics/${command}s/`;
    let dataLoc = `./data/image_data/${command}Data.json`;



    utilitiesModule.readJSONFile(dataLoc, function (dataJson) {

        let images = fs.readdirSync(photoLoc);
        let selectedImage = images[Math.floor(Math.random() * images.length)];
        let jsonObj = dataJson[selectedImage];

        //Setting json stuff
        if (!jsonObj) jsonObj = { amount: 0 };
        jsonObj.amount++;
        if (!jsonObj.rarity) jsonObj.rarity = "Not set yet";
        
        //Javascript can't do pass by reference, so when I set jsonObj = dataJson[selectedImage], it gained all of the values of dataJson[selectedImage],
        //but changing the values in jsonObj does not affect dataJson[selectedImage]. This is a shame because jsonObj is much more readable (particularly
        //because it's used a lot further on), so in order to maintain that clean aspect, I have to manually set dataJson[selectedImage] = jsonObj, which in
        //a sense lets the original json file know that its been updated.
        dataJson[selectedImage] = jsonObj;
        fs.writeFileSync(dataLoc, JSON.stringify(dataJson, null, 4), function(err) {if (err) return err;});

        let stats = fs.statSync(`${photoLoc + selectedImage}`);
        let fileSize = (stats["size"] / 1000000.0).toFixed(2);

        if (fileSize > 8) {
            message.channel.send(`That fuckin image is **${fileSize}mb** big, I physically cannot upload that`);
            return;
        }

        let newEmbed = new Discord.RichEmbed();

        if (selectedImage == "komugi shibe 1.jpg") {
            newEmbed.addField(`Holy shit, a ${selectedImage}!!`, `There was a 1/${shibes.length} chance of that happening!`);
            newEmbed.setColor("#ff0000");
        }
        else {
            newEmbed.addField(`${selectedImage}`, `Amount unboxed: ${jsonObj.amount}`);
            newEmbed.addField(`Rarity`, `${jsonObj.rarity}`);
            newEmbed.addField(`Size`, `${fileSize}mb`);

            switch(jsonObj.rarity) {
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
        message.channel.send({ files: [`${photoLoc + selectedImage}`] })
            .then(function(msg) {

                if (jsonObj.rarity == "Not set yet") {

                    const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 15000 });
                    collector.on('collect', message => {

                        msg = message.content.toLowerCase();
                        if (msg == "common" || msg == "uncommon" || msg == "rare" || msg == "epic" || msg == "legendary") {

                            switch (msg) {
                                case "common":
                                    jsonObj.rarity = "Common";
                                    break;

                                case "uncommon":
                                    jsonObj.rarity = "Uncommon";
                                    break;
                                
                                case "rare":
                                    jsonObj.rarity = "Rare";
                                    break;

                                case "epic":
                                    jsonObj.rarity = "Epic";
                                    break;
                                
                                case "legendary":
                                    jsonObj.rarity = "Legendary";
                                    break;
                            }
                            
                            dataJson[selectedImage] = jsonObj;
                            fs.writeFileSync(dataLoc, JSON.stringify(dataJson, null, 4), function(err) {if (err) return err;});

                            message.react("✅");
                            utilitiesModule.incrementUserDataValue(message.author, "Billie-Bucks", 1);
                            collector.stop();

                        }

                    });
                    
                }

            })
            .catch(console.error);
    });
}