const fs = require("fs");
const gm = require("gm");
const imageMagick = require('gm').subClass({imageMagick: true});
const request = require("request");
const rp = require("request-promise");

const utilitiesModule = require('../../utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.1;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${utilitiesModule.getRandomNameInsult(message.author)}`);
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
            message.channel.send(`That's not a fucking number, ${utilitiesModule.getRandomNameInsult(message.author)}`);
            return;
        }
        else {
            if (args[0] < -99) {
                message.channel.send(`I'm not letting you go lower than -99, ${utilitiesModule.getRandomNameInsult(message.author)}`);
                return;
            }
            else if (args[0] > 99) {
                message.channel.send(`I'm not letting you go higher than 99, ${utilitiesModule.getRandomNameInsult(message.author)}`);
                return;
            }
            magikAmount = args[0];
        }
    }

    //If the user supplied more than one parameter, return
    else {
        message.channel.send(`Too many parameters, ${utilitiesModule.getRandomNameInsult(message.author)}`);
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
                    let setToReduce = false;

                    if (fileSize > maxFileSize) {
                        message.channel.send(`This image is ~${fileSize}mb, I gotta chop it down until it's lower than ${maxFileSize}mb (might take a bit, be patient)`);
                        setToReduce = true;
                    }
                    else {
                        message.channel.send(`alright hold on, performing magik on a ~${fileSize}mb image`);
                    }

                    //Do operations on image and save it to disk
                    gm(request(foundURL))
                        .write(`./graphics/${filename}.png`, function (err) {
                            //Start recursion if we need to
                            if (setToReduce) {
                                reduceImageFileSize(message, filename, 1);
                            }

                            //Otherwise, just post it
                            else {
                                message.channel.send({ files: [`./graphics/${filename}.png`] })
                                    .then(function(msg) {
                                        fs.unlink(`./graphics/${filename}.png`, function(err) { if (err) throw err; });
                                    })
                                    .catch(console.error);
                            }
                        });
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

function reduceImageFileSize(message, filename, chopNum) {
    gm(`./graphics/${filename}.png`)
        .minify()
        .write(`./graphics/${filename}.png`, function (err) {
            let stats = fs.statSync(`./graphics/${filename}.png`);
            let fileSize = (stats["size"] / 1000000.0).toFixed(2);

            if (fileSize > maxFileSize) {
                reduceImageFileSize(message, filename, chopNum+1);
            }
            else {
                message.channel.send(`Alright I had to chop it ${chopNum} time${(chopNum > 1) ? 's' : ''}, posting now`);
                message.channel.send({ files: [`./graphics/${filename}.png`] })
                    .then(function(msg) {
                        fs.unlink(`./graphics/${filename}.png`, function(err) { if (err) throw err; });
                    })
                    .catch(console.error);
            }
        });
}