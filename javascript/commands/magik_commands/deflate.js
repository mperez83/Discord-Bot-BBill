const fs = require("fs");
const gm = require("gm");
const request = require("request");
const rp = require("request-promise");

const utilitiesModule = require('../../utilities');
const magikUtilities = require('../../magikUtilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 2;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${utilitiesModule.getRandomNameInsult(message)}`);
        return;
    }

    let deflateAmount = 1;
    let appendSuggestion = false;

    //If the user didn't supply a strength level, keep the deflation level normal
    if (args.length == 0) {
        //keep deflateAmount at default value
    }

    //If the user supplied a strength level for the deflation, do tons of bullshit checking
    else if (args.length == 1) {
        if (isNaN(args[0])) {
            message.channel.send(`That's not a fucking number, ${utilitiesModule.getRandomNameInsult(message)}`);
            return;
        }
        else {
            if (args[0] < 0) {
                message.channel.send(`Go use !inflate to do reverse deflates, ${utilitiesModule.getRandomNameInsult(message)}`);
                return;
            }
            else if (args[0] == 0) {
                message.channel.send(`???`);
                return;
            }
            else if (args[0] > 1 && args[0] <= 99) {
                appendSuggestion = true;
                //message.channel.send(`making a black hole huh`);
            }
            else if (args[0] > 99) {
                message.channel.send(`I'm not letting you go higher than 99, ${utilitiesModule.getRandomNameInsult(message)}`);
                return;
            }
            deflateAmount = args[0];
        }
    }

    //If the user supplied more than one parameter, return
    else {
        message.channel.send(`Too many parameters, ${utilitiesModule.getRandomNameInsult(message)}`);
        return;
    }

    //Arbitrary divide by 2, to make the strength levels more sensible
    deflateAmount /= 2;



    utilitiesModule.getMostRecentImageURL(message).then(returnedURL => {

        let foundURL = returnedURL;

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
                                        .implode(deflateAmount)
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
                    }

                    //Otherwise, just do magik on the image directly
                    else {
                        let msg = `alright hold on, deflating a ~${fileSize}mb image`;
                        if (appendSuggestion) msg += ` (for best results, keep deflation strength less than 1)`;
                        message.channel.send(msg);

                        gm(request(foundURL))
                            .implode(deflateAmount)
                            .write(`./graphics/${filename}.png`, function (err) {
                                if (err) console.error(err);

                                message.channel.send({ files: [`./graphics/${filename}.png`] })
                                    .then(function(msg) {
                                        fs.unlink(`./graphics/${filename}.png`, function(err) { if (err) throw err; });
                                    })
                                    .catch(console.error);
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
    name: "deflate"
}