const Discord = require("discord.js");
const fs = require("fs");

const userDB = require(`../database_stuff/user_database_handler`);
const imageUnboxDB = require(`../database_stuff/image_unbox_database_handler`);

let rarityMessageCollectors = new Discord.Collection();



module.exports.unboxImage = (message, imageType) => {

    let photoLoc = ``;

    if (Math.floor(Math.random() * 100) < 5) imageType = `komugi`;
    
    photoLoc = `./graphics/image_unbox_graphics/${imageType}/`;



    fs.readdir(photoLoc, (err, images) => { //This fucks up the collector, I think

        if (err) console.error(err);

        let imageName = images[Math.floor(Math.random() * images.length)];

        let stats = fs.statSync(`${photoLoc + imageName}`);
        let fileSize = (stats["size"] / 1000000.0).toFixed(2);

        if (fileSize > 8) {
            message.channel.send(`"${imageName}" is **${fileSize}mb** big, I physically cannot upload that`);
            return;
        }

        let amountUnboxedEntry = imageUnboxDB.getAmountUnboxed(imageType, imageName);
        let rarityEntry = imageUnboxDB.getRarity(message.guild, imageType, imageName);

        amountUnboxedEntry.total_unboxed++;

        let newEmbed = new Discord.RichEmbed();

        if (imageName == "komugi shibe 1.jpg") {
            newEmbed.addField(`Holy shit, a ${imageName}!!`, `There was a 1/${images.length} chance of that happening!`);
            newEmbed.setColor("#ff0000");
        }
        else {
            newEmbed.addField(`${imageName}`, `Global unboxes: ${amountUnboxedEntry.total_unboxed}`);
            newEmbed.addField(`Rarity`, `${rarityEntry.rarity}`);
            newEmbed.addField(`Size`, `${fileSize}mb`);

            switch(rarityEntry.rarity) {
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
                    
                default:
                    newEmbed.setColor("#000000");
                    break;
            }
        }

        imageUnboxDB.updateAmountUnboxed(amountUnboxedEntry);

        message.channel.send(newEmbed);
        message.channel.send({ files: [`${photoLoc + imageName}`] })
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

                //Ensure that only one rarity collector is ever active at a given time
                if (rarityMessageCollectors.get(`${msg.channel.id}-${msg.author.id}`)) {
                    rarityMessageCollectors.get(`${msg.channel.id}-${msg.author.id}`).stop();
                }

                let collector = msg.channel.createMessageCollector(rarityFilter, { time: 15000 });

                collector.on('collect', (message) => {
                    userMsg = message.content.toLowerCase();
                    if (userMsg == "common" || userMsg == "uncommon" || userMsg == "rare" || userMsg == "epic" || userMsg == "legendary") {
                        rarityEntry.rarity = userMsg.charAt(0).toUpperCase() + userMsg.slice(1);
                        imageUnboxDB.updateRarity(message.guild, rarityEntry);
                        userDB.addMiscDataValue(message.author, "billie_bucks", 5);
                        message.react(`✅`);
                        collector.stop();
                    }
                });

                rarityMessageCollectors.set(`${msg.channel.id}-${msg.author.id}`, collector);

            })
            .catch(console.error);

    });
        
}