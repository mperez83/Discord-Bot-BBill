const fs = require("fs");
const gm = require("gm");
const request = require("request");
const rp = require("request-promise");

const utilitiesModule = require('../../utilities');
const config = require("../../../data/general_data/config.json");



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
                    let fileSize = (response.headers['content-length'] / 1000000.0).toFixed(2);
    
                    if (fileSize > 0.5) {
                        message.channel.send(`I can't turn this into a spider, ${utilitiesModule.getRandomNameInsult(message)} (larger than 0.5mb)`);
                        return;
                    }
                    else {
                        gm(request(foundURL))
                            .size(function getSize(err, size) {
                                if (err) console.error(err);
                                else {
                                    let maxSingeAmount = (size.width < size.height) ? Math.floor(size.width / 2) - 1 : Math.floor(size.height / 2) - 1;
                                    let singeAmount = (maxSingeAmount < 99) ? maxSingeAmount : 99;

                                    message.channel.send(`hatching the ~${fileSize}mb creature (takes a while, be patient)`);

                                    let filename = Date.now();
                    
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
                                }
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