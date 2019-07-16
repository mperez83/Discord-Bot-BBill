const fs = require("fs");
const gm = require("gm");
const request = require("request");
const rp = require("request-promise");

const utilitiesModule = require('../../utilities');
const magikUtilities = require('../../magikUtilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.5;
const maxGifFrames = 10;
const maxIntensity = 2;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${utilitiesModule.getRandomNameInsult(message)}`);
        return;
    }



    let gifFrames = 6;
    let intensity = 1;

    if (args.length == 0) {
        //keep gifFrames and intensity at their default values
    }

    else if (args.length == 1 || args.length == 2) {
        if (isNaN(args[0])) {
            message.channel.send(`The provided frame amount isn't a number, ${utilitiesModule.getRandomNameInsult(message)}`);
            return;
        }
        else {
            if (args[0] < 2) {
                message.channel.send(`Gifs are composed of more than one frame, ${utilitiesModule.getRandomNameInsult(message)}`);
                return;
            }
            else if (args[0] > maxGifFrames) {
                message.channel.send(`I really don't want to go higher than ${maxGifFrames} frames, ${utilitiesModule.getRandomNameInsult(message)}`);
                return;
            }
            gifFrames = args[0];
        }

        if (args.length == 2) {
            if (isNaN(args[1])) {
                message.channel.send(`The provided intensity isn't a number, ${utilitiesModule.getRandomNameInsult(message)}`);
                return;
            }
            else {
                if (args[1] <= 0) {
                    message.channel.send(`Can't have an intensity of 0 or less, ${utilitiesModule.getRandomNameInsult(message)}`);
                    return;
                }
                else if (args[1] > maxIntensity) {
                    message.channel.send(`Max intensity is ${maxIntensity}, ${utilitiesModule.getRandomNameInsult(message)}`);
                    return;
                }
                intensity = args[1];
            }
        }
    }

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

                    //Save image to disk before doing operations
                    gm(request(foundURL))
                        .write(`./graphics/${filename}.png`, function(err) {
                            if (err) console.error(err);

                            //If the image is too big, reduce it before performing the operations
                            if (fileSize > maxFileSize) {
                                message.channel.send(`This image is **~${fileSize}mb**, I gotta chop it down until it's lower than **${maxFileSize}mb** (might take a bit, be patient)`);
                                magikUtilities.reduceImageFileSize(message, filename, 1, maxFileSize, () => {
                                    performUndulationMagick(message, filename, gifFrames, intensity);
                                });
                            }
                            else {
                                performUndulationMagick(message, filename, gifFrames, intensity);
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
    name: "undulate"
}



function performUndulationMagick(message, filename, gifFrames, intensity) {
    message.channel.send(`alright hold on, creating an undulated gif`);

    let writeRequests = 0;
    for (let i = 0; i < gifFrames; i++) {

        writeRequests++;

        gm(`./graphics/${filename}.png`)
            .implode((Math.random() - 0.5) * intensity)
            .write(`./graphics/${filename}-${i}.png`, function (err) {
                if (err) console.error(err);
                
                writeRequests--;

                //If we've written all of the undulated images, generate the gif and post it
                if (writeRequests == 0) {
                    fs.unlink(`./graphics/${filename}.png`, function(err) { if (err) throw err; }); //Delete this because we don't need it anymore
                    generateGif(message, filename, gifFrames);
                }
            });

    }
}

function generateGif(message, filename, gifFrames) {
    let gifImg = gm();

    for (let i = 0; i < gifFrames; i++) {
        gifImg
            .in(`./graphics/${filename}-${i}.png`);
    }

    gifImg
        .delay(6)
        .write(`./graphics/${filename}.gif`, function(err){
            if (err) throw err;

            message.channel.send({ files: [`./graphics/${filename}.gif`] })
                .then(function(msg) {
                    for (let i = 0; i < gifFrames; i++) {
                        fs.unlink(`./graphics/${filename}-${i}.png`, function(err) { if (err) throw err; });
                    }
                    fs.unlink(`./graphics/${filename}.gif`, function(err) { if (err) throw err; });
                })
                .catch(console.error);
        });
}