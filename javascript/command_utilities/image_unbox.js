const Discord = require("discord.js");
const fs = require("fs");

let rarityMessageCollectors = new Discord.Collection();



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

                const rarityFilter = (userMsg) => {
                    if (userMsg.author.id === message.author.id) {
                        switch (userMsg.content.toLowerCase()) {
                            case `common`:
                            case `uncommon`:
                            case `rare`:
                            case `epic`:
                            case `legendary`:
                                return true;
                        }
                    }
                    return false;
                }

                if (rarityMessageCollectors.get(`${msg.channel.id}-${msg.author.id}`)) {
                    rarityMessageCollectors.get(`${msg.channel.id}-${msg.author.id}`).stop();
                }

                let collector = msg.channel.createMessageCollector(rarityFilter, { time: 15000 });

                collector.on('collect', (message) => {
                    userMsg = message.content.toLowerCase();
                    if (userMsg == "common" || userMsg == "uncommon" || userMsg == "rare" || userMsg == "epic" || userMsg == "legendary") {
                        message.react("✅");
                        collector.stop();
                    }
                });

                rarityMessageCollectors.set(`${msg.channel.id}-${msg.author.id}`, collector);

            })
            .catch(console.error);

    });
        
}