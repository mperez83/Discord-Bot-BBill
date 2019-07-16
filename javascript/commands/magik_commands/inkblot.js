const fs = require("fs");
const gm = require("gm");
const request = require("request");
const rp = require("request-promise");

const utilitiesModule = require('../../utilities');
const magikUtilities = require('../../magikUtilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.5;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${utilitiesModule.getRandomNameInsult(message)}`);
        return;
    }

    //If the user tried to supply some kind of argument, cut that shit right off
    if (args.length > 0) {
        message.channel.send(`Inkblot doesn't use parameters, ${utilitiesModule.getRandomNameInsult(message)}`);
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

                    let msg = `Starting inkblot process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtilities.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performInkblotMagik(message, filename);
                    });

                })
                .catch(function (err) {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "inkblot"
}



function performInkblotMagik(message, filename) {
    //message.channel.send(`Inkblotting the image...`);

    gm(`./graphics/${filename}.png`)
        .size(function getSize(err, size) {
            if (err) console.error(err);

            let maxSingeAmount = (size.width < size.height) ? Math.floor(size.width / 2) - 1 : Math.floor(size.height / 2) - 1;
            let singeAmount = (maxSingeAmount < 99) ? maxSingeAmount : 99;

            gm(`./graphics/${filename}.png`)
                .charcoal(1)
                .charcoal(1)
                .charcoal(1)
                .charcoal(1)
                .charcoal(singeAmount / 2)
                .charcoal(singeAmount)
                .charcoal(singeAmount)
                .charcoal(singeAmount)
                .charcoal(singeAmount)
                .write(`./graphics/${filename}.png`, function (err) {
                    if (err) console.error(err);

                    message.channel.send({ files: [`./graphics/${filename}.png`] })
                        .then(function(msg) {
                            fs.unlink(`./graphics/${filename}.png`, function(err) { if (err) throw err; });
                        })
                        .catch(console.error);
                });
        });
}