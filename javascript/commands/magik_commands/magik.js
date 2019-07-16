const fs = require("fs");
const gm = require("gm");
const imageMagick = require('gm').subClass({imageMagick: true});
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

    let magikAmount = 1;

    //If the user didn't supply a strength level, keep the magik level normal
    if (args.length == 0) {
        //keep magikAmount at default value
    }

    //If the user supplied a strength level for the magik, do tons of bullshit checking
    else if (args.length == 1) {
        if (isNaN(args[0])) {
            message.channel.send(`That's not a fucking number, ${utilitiesModule.getRandomNameInsult(message)}`);
            return;
        }
        else {
            if (args[0] < -99) {
                message.channel.send(`I'm not letting you go lower than -99, ${utilitiesModule.getRandomNameInsult(message)}`);
                return;
            }
            else if (args[0] > 99) {
                message.channel.send(`I'm not letting you go higher than 99, ${utilitiesModule.getRandomNameInsult(message)}`);
                return;
            }
            magikAmount = args[0];
        }
    }

    //If the user supplied more than one parameter, return
    else {
        message.channel.send(`Too many parameters, ${utilitiesModule.getRandomNameInsult(message)}`);
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

                    //If we need to do recursive filesize reduction, we need to write the file to disk first
                    if (fileSize > maxFileSize) {
                        message.channel.send(`This image is **~${fileSize}mb**, I gotta chop it down until it's lower than **${maxFileSize}mb** (might take a bit, be patient)`);
                        gm(request(foundURL))
                            .write(`./graphics/${filename}.png`, function (err) {
                                if (err) console.error(err);

                                magikUtilities.reduceImageFileSize(message, filename, 1, maxFileSize, () => {
                                    for (let i = 0; i < 5; i++) {
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
                                });
                            });
                    }

                    //Otherwise, just do magik on the image directly
                    else {
                        message.channel.send(`alright hold on, doing magik on a ~${fileSize}mb image`);

                        let writeRequests = 0;
                        for (let i = 0; i < 5; i++) {
                            writeRequests++;
                            gm(request(foundURL))
                                .implode(Math.random())
                                .write(`./graphics/${filename}-${i}.png`, function (err) {
                                    if (err) console.error(err);
                                    
                                    writeRequests--;
                                    if (writeRequests == 0) {
                                        gm()
                                            .in(`./graphics/${filename}-0.png`)
                                            .in(`./graphics/${filename}-1.png`)
                                            .in(`./graphics/${filename}-2.png`)
                                            .in(`./graphics/${filename}-3.png`)
                                            .in(`./graphics/${filename}-4.png`)
                                            .delay(10)
                                            .write(`./graphics/${filename}.gif`, function(err){
                                                if (err) throw err;

                                                message.channel.send({ files: [`./graphics/${filename}.gif`] })
                                                    .then(function(msg) {
                                                        fs.unlink(`./graphics/${filename}-0.png`, function(err) { if (err) throw err; });
                                                        fs.unlink(`./graphics/${filename}-1.png`, function(err) { if (err) throw err; });
                                                        fs.unlink(`./graphics/${filename}-2.png`, function(err) { if (err) throw err; });
                                                        fs.unlink(`./graphics/${filename}-3.png`, function(err) { if (err) throw err; });
                                                        fs.unlink(`./graphics/${filename}-4.png`, function(err) { if (err) throw err; });
                                                        fs.unlink(`./graphics/${filename}.gif`, function(err) { if (err) throw err; });
                                                    })
                                                    .catch(console.error);
                                            });
                                    }
                                });
                        }
                    }

                })
                .catch(function (err) {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "magik"
}