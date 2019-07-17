const fs = require("fs");
const gm = require("gm");
const rp = require("request-promise");

const utilitiesModule = require('../../utilities');
const magikUtilities = require('../../magikUtilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.256;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${utilitiesModule.getRandomNameInsult(message)}`);
        return;
    }



    utilitiesModule.getMostRecentImageURL(message).then(requestedURL => {

        let foundURL = requestedURL;

        if (!foundURL) {
            return;
        }
        else {
            let options = {
                uri: foundURL,
                resolveWithFullResponse: true
            };

            rp(options)
                .then(function (response) {

                    let filename = Date.now();
                    let fileSize = (response.headers['content-length'] / 1000000.0).toFixed(2);

                    if (fileSize < maxFileSize) {
                        message.channel.send(`That image is already small enough to be an emote, ${utilitiesModule.getRandomNameInsult(message)}`);
                        return;
                    }
                    else {
                        let msg = `Starting emotify process`;
                        if (fileSize > maxFileSize) msg += ` (the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                        message.channel.send(msg);

                        magikUtilities.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                            performEmotifyMagik(message, filename);
                        });
                    }

                })
                .catch(function (err) {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "emotify"
}



function performEmotifyMagik(message, filename) {
    //message.channel.send(`Emotifying the image...`);

    gm(`./graphics/${filename}.png`)
        .write(`./graphics/${filename}.png`, function (err) {
            if (err) console.error(err);

            message.channel.send({ files: [`./graphics/${filename}.png`] })
                .then(function(msg) {
                    fs.unlink(`./graphics/${filename}.png`, function(err) { if (err) throw err; });
                })
                .catch(console.error);
        });
}