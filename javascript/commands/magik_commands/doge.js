const fs = require("fs");
const gm = require("gm");

const genUtils = require("../../command_utilities/general_utilities");
const config = require("../../../data/general_data/config.json");



module.exports.run = async (bot, message, args) => {

    if (args.length > 0) {
        message.channel.send(`doge doesn't take parameters, ${genUtils.getRandomNameInsult(message)}`);
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
        .write(`./graphics/doge/${filename}.png`, (err) => {
            if (err) { console.error(err); }
            message.channel.send({ files: [`./graphics/doge/${filename}.png`] })
                .then((msg) => {
                    fs.unlink(`./graphics/doge/${filename}.png`, (err) => { if (err) console.error(err); });
                })
                .catch(console.error);
        });
    
}

module.exports.help = {
    name: "doge",
    description: "Creates a doge that's as long as there are o's in the command call",
    usage: "!doge",
    example: "!doooooge",
    funFacts: [
        `This is one of my favorite commands. The graphic isn't seamless, but the infrastructure is there to create other similar commands.`,
        `This command is woefully undersued.`
    ]
}