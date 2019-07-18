const fs = require("fs");
const gm = require("gm");
const rp = require("request-promise");

const utilitiesModule = require('../../utilities');
const magikUtilities = require('../../magikUtilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.5;
const maxGifFrameCount = 10;
const maxIntensity = 2;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${utilitiesModule.getRandomNameInsult(message)}`);
        return;
    }



    let gifFrameCount = 6;
    let intensity = 1;

    if (args.length == 0) {
        //keep gifFrameCount and intensity at their default values
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
            else if (args[0] > maxGifFrameCount) {
                message.channel.send(`I really don't want to go higher than ${maxGifFrameCount} frames, ${utilitiesModule.getRandomNameInsult(message)}`);
                return;
            }
            gifFrameCount = args[0];
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

                    let msg = `Starting undulate process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtilities.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performUndulationMagik(message, filename, gifFrameCount, intensity);
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



function performUndulationMagik(message, filename, gifFrameCount, intensity) {
    //message.channel.send(`Undulating a gif...`);

    let writeRequests = 0;
    for (let i = 0; i < gifFrameCount; i++) {

        writeRequests++;

        gm(`./graphics/${filename}.png`)
            .implode((Math.random() - 0.5) * intensity)
            .write(`./graphics/${filename}-${i}.png`, function (err) {
                if (err) console.error(err);
                
                writeRequests--;

                //If we've written all of the undulated images, delete the source image and generate the gif
                if (writeRequests == 0) {
                    fs.unlink(`./graphics/${filename}.png`, function(err) { if (err) throw err; });

                    magikUtilities.generateGif(message, filename, gifFrameCount, 6, () => {

                        //Once the gif is generated, post it
                        message.channel.send({ files: [`./graphics/${filename}.gif`] })
                            .then(function(msg) {
                                fs.unlink(`./graphics/${filename}.gif`, function(err) { if (err) throw err; });
                                for (let i = 0; i < gifFrameCount; i++) {
                                    fs.unlink(`./graphics/${filename}-${i}.png`, function(err) { if (err) throw err; });
                                }
                            })
                            .catch(console.error);

                    });

                }
            });

    }
}