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
        message.channel.send(`Spiders don't need parameters, ${utilitiesModule.getRandomNameInsult(message)}`);
        return;
    }



    let foundURL;

    utilitiesModule.getMostRecentImageURL(message).then(requestedURL => {

        foundURL = requestedURL;

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

                    //If we need to do recursive filesize reduction, we need to write the file to disk first
                    if (fileSize > maxFileSize) {
                        message.channel.send(`This image is **~${fileSize}mb**, I gotta chop it down until it's lower than **${maxFileSize}mb** (might take a bit, be patient)`);
                        gm(request(foundURL))
                            .write(`./graphics/${filename}.png`, function (err) {
                                if (err) console.error(err);

                                magikUtilities.reduceImageFileSize(message, filename, 1, maxFileSize, () => {
                                    gm(`./graphics/${filename}.png`)
                                        .size(function getSize(err, size) {
                                            if (err) console.error(err);

                                            let maxSingeAmount = (size.width < size.height) ? Math.floor(size.width / 2) - 1 : Math.floor(size.height / 2) - 1;
                                            let singeAmount = (maxSingeAmount < 99) ? maxSingeAmount : 99;

                                            gm(`./graphics/${filename}.png`)
                                                .implode(1 + (Math.random() * 0.5))
                                                .implode(-3 + (Math.random() * -3))
                                                .charcoal(1)
                                                .charcoal(1)
                                                .charcoal(1)
                                                .charcoal(1)
                                                .charcoal(singeAmount)
                                                .blur(singeAmount)
                                                .blur(singeAmount)
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
                                });
                            });
                    }

                    //Otherwise, just do magik on the image directly
                    else {
                        message.channel.send(`hatching the ~${fileSize}mb creature (takes a while, be patient)`);
                        gm(request(foundURL))
                            .size(function getSize(err, size) {
                                if (err) console.error(err);

                                let maxSingeAmount = (size.width < size.height) ? Math.floor(size.width / 2) - 1 : Math.floor(size.height / 2) - 1;
                                let singeAmount = (maxSingeAmount < 99) ? maxSingeAmount : 99;

                                gm(request(foundURL))
                                    .implode(1 + (Math.random() * 0.5))
                                    .implode(-3 + (Math.random() * -3))
                                    .charcoal(1)
                                    .charcoal(1)
                                    .charcoal(1)
                                    .charcoal(1)
                                    .charcoal(singeAmount)
                                    .blur(singeAmount)
                                    .blur(singeAmount)
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

                })
                .catch(function (err) {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "spider"
}