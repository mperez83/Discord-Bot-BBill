const gm = require("gm");
const utilitiesModule = require('../utilities');
const config = require("../../data/general_data/config.json");



module.exports.run = async (bot, message, args) => {

    if (args.length > 0) {
        message.channel.send(`doge doesn't take parameters, ${utilitiesModule.getRandomNameInsult()}`);
        return;
    }



    let filename = Date.now();
    let pos = 125;  //Where the body starts (right side of the head)
    let bodywidth = 125;    //Width of each body segment

    let command = message.content.split(/\s+/g)[0];
    command = command.slice(config.prefix.length);

    let o = command.split("o").length-1;
    if (o > 20) { o = 20; }
    let catlength = pos+o*bodywidth;

    let catimg = gm()
        .in("-page", "+0+0")
        .in("./graphics/doge/dogehead.png");

    for(pos; pos < catlength; pos += bodywidth) {
        catimg
            .in("-page", "+"+pos+"+0")
            .in("./graphics/doge/dogebody.png");
    }

    catimg
        .in("-page", "+"+pos+"+0")
        .in("./graphics/doge/dogebutt.png")
        .background("transparent")
        .mosaic()
        .write("./graphics/doge/"+filename+".png", function(err){
            if(err) { console.log(err); }
            message.channel.send({ files: [`./graphics/doge/${filename}.png`] });
        });
    
}

module.exports.help = {
    name: "doge"
}