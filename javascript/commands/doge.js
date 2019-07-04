const gm = require("gm");
const utilitiesModule = require("../utilities");
const config = require("../../data/general_data/config.json");



module.exports.run = async (bot, message, args) => {

    if (args.length > 0) {
        message.channel.send(`doge doesn't take parameters, ${utilitiesModule.getRandomNameInsult()}`);
        return;
    }


    //This all assumes the creatures is facing to the left

    let filename = Date.now();
    let pos = 125;          //Where the body starts (right side of the head)
    let bodyWidth = 125;    //Width of each body segment

    let command = message.content.split(/\s+/g)[0];
    command = command.slice(config.prefix.length);

    let oCount = command.split("o").length - 1;
    if (oCount > 20) { oCount = 20; }
    let dogelength = pos + (oCount * bodyWidth);

    let dogeimg = gm()
        .in(`-page`, `+0+0`)
        .in(`./graphics/doge/dogehead.png`);

    for(pos; pos < dogelength; pos += bodyWidth) {
        dogeimg
            .in(`-page`, `+${pos}+0`)
            .in(`./graphics/doge/dogebody.png`);
    }

    dogeimg
        .in(`-page`, `+${pos}+0`)
        .in(`./graphics/doge/dogebutt.png`)
        .background("transparent")
        .mosaic()
        .write(`./graphics/doge/${filename}.png`, function(err){
            if(err) { console.log(err); }
            message.channel.send({ files: [`./graphics/doge/${filename}.png`] });
        });
    
}

module.exports.help = {
    name: "doge"
}