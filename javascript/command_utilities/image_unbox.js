const Discord = require("discord.js");
const fs = require("fs");



module.exports.unboxImage = (message, imageName) => {

    let photoLoc = ``;

    if (Math.floor(Math.random() * 100) < 5)
        photoLoc = `./graphics/image_unbox_graphics/komugi/`;
    else
        photoLoc = `./graphics/image_unbox_graphics/${imageName}/`;



    fs.readdir(photoLoc, (err, images) => { //This fucks up the collector, I think

        if (err) console.error(err);

        let selectedImage = images[Math.floor(Math.random() * images.length)];

        let stats = fs.statSync(`${photoLoc + selectedImage}`);
        let fileSize = (stats["size"] / 1000000.0).toFixed(2);

        if (fileSize > 8) {
            message.channel.send(`"${selectedImage}" is **${fileSize}mb** big, I physically cannot upload that`);
            return;
        }

        let newEmbed = new Discord.RichEmbed();

        if (selectedImage == "komugi shibe 1.jpg") {
            newEmbed.addField(`Holy shit, a ${selectedImage}!!`, `There was a 1/${images.length} chance of that happening!`);
            newEmbed.setColor("#ff0000");
        }
        else {
            newEmbed.addField(`${selectedImage}`, `Amount unboxed: ???`);
            newEmbed.addField(`Rarity`, `???`);
            newEmbed.addField(`Size`, `${fileSize}mb`);

            /*switch(jsonObj.rarity) {
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
            }*/
        }

        message.channel.send(newEmbed);
        message.channel.send({ files: [`${photoLoc + selectedImage}`] })
            .then((msg) => {

                /*if (selectedImage == "komugi shibe 1.jpg") {
                    jsonObj.rarity = "Legendary";
                    dataJson[selectedImage] = jsonObj;
                    fs.writeFile(dataLoc, JSON.stringify(dataJson, null, 4), (err) => { if (err) console.error(err); });
                    return;
                }*/

                const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 15000 });
                collector.on('collect', (message) => {

                    msg = message.content.toLowerCase();
                    if (msg == "common" || msg == "uncommon" || msg == "rare" || msg == "epic" || msg == "legendary") {

                        message.react("✅");
                        collector.stop();

                        /*switch (msg) {
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
                        }*/

                    }

                });

            })
            .catch(console.error);

    });
        
}