const fs = require("fs");
const gm = require("gm");
const imageMagick = require('gm').subClass({imageMagick: true});
const request = require("request");
const remote = require("remote-file-size");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {

    //If the user tried to supply some kind of argument, cut that shit right off
    if (args.length > 0) {
        message.channel.send("Spiders don't need parameters, " + utilitiesModule.getRandomNameInsult());
        return;
    }

    utilitiesModule.getMostRecentImageURL(message).then(validURL => {

        if (!validURL) {
            return;
        }
        else {
            remote(validURL, function(err, size) {
                let fileSize = (size / 1000000.0).toFixed(2);
    
                if (fileSize > 0.2) {
                    message.channel.send(`I can't turn this into a spider, ${utilitiesModule.getRandomNameInsult()} (larger than 0.2mb)`);
                    return;
                }
                else {
                    let msg = `hatching (~${fileSize}mb)`;
                    message.channel.send(msg);
    
                    //Directly write method (not asynchronous??)
                    gm(request(validURL))
                        .implode(1)
                        .implode(-4)
                        .charcoal(1)
                        .charcoal(1)
                        .charcoal(1)
                        .charcoal(1)
                        .charcoal(50)
                        .charcoal(99)
                        .charcoal(99)
                        .charcoal(99)
                        .filter("Gaussian")
                        .minify()
                        .minify()
                        .minify()
                        .magnify()
                        .magnify()
                        .magnify()
                        .charcoal(99)
                        .write('./graphics/resultImage.png', function (err) {
                            if (err) console.log(err);
                            message.channel.send({ files: ["./graphics/resultImage.png"]});
                        });
                }
            });
        }
        
    });

}

module.exports.help = {
    name: "spider"
}