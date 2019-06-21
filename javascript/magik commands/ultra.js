const fs = require("fs");
const gm = require("gm");
const imageMagick = require('gm').subClass({imageMagick: true});
const request = require("request");
const remote = require("remote-file-size");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {

    //If the user tried to supply some kind of argument, cut that shit right off
    if (args.length > 0) {
        message.channel.send("no parameters here, " + utilitiesModule.getRandomNameInsult());
        return;
    }

    utilitiesModule.getMostRecentImageURL(message).then(validURL => {

        if (!validURL) {
            return;
        }
        else {
            remote(validURL, function(err, size) {
                let fileSize = (size / 1000000.0).toFixed(2);
    
                if (fileSize > 2) {
                    message.channel.send(`I can't make this go ultra, ${utilitiesModule.getRandomNameInsult()} (larger than 2mb)`);
                    return;
                }
                else {
                    let msg = `improving (~${fileSize}mb)`;
                    message.channel.send(msg);

                    let sharpenIntensity = 0;
    
                    gm(request(validURL))
                        .size(function (err, size) {
                            if (err) console.error(err);
                            else {
                                sharpenIntensity = (size.width < size.height) ? Math.floor(size.width / 2) - 1 : Math.floor(size.height / 2) - 1;
                                console.log(sharpenIntensity);
                            }
                        })
                        .filter("Gaussian")
                        .minify()
                        .magnify()
                        .sharpen(sharpenIntensity)
                        .sharpen(sharpenIntensity)
                        .sharpen(sharpenIntensity)
                        .sharpen(sharpenIntensity)
                        .sharpen(sharpenIntensity)
                        .modulate(100, 500)
                        .write('./graphics/resultImage.png', function (err) {
                            if (err) console.log(err);
                            console.log("posting");
                            message.channel.send({ files: ["./graphics/resultImage.png"]});
                        });
                }
            });
        }
        
    });

}

module.exports.help = {
    name: "ultra"
}