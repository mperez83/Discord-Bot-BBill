const fs = require("fs");
const gm = require("gm");
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.25;
const maxIntensity = 10;
const maxGifFrameCount = 30;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    let gifFrameCount = 20;
    let intensity = 1;

    if (args.length == 0) {
        //keep gifFrameCount and intensity at their default values
    }

    else if (args.length == 1 || args.length == 2) {
        if (isNaN(args[0])) {
            message.channel.send(`The provided intensity isn't a number, ${genUtils.getRandomNameInsult(message)}`);
            return;
        }
        else {
            if (args[0] <= 0) {
                message.channel.send(`Can't have an intensity of 0 or less, ${genUtils.getRandomNameInsult(message)}`);
                return;
            }
            else if (args[0] > maxIntensity) {
                message.channel.send(`Max intensity is ${maxIntensity}, ${genUtils.getRandomNameInsult(message)}`);
                return;
            }
            intensity = args[0];
        }

        if (args.length == 2) {
            if (isNaN(args[1])) {
                message.channel.send(`The provided frame amount isn't a number, ${genUtils.getRandomNameInsult(message)}`);
                return;
            }
            else {
                if (args[1] < 2) {
                    message.channel.send(`Gifs are composed of more than one frame, ${genUtils.getRandomNameInsult(message)}`);
                    return;
                }
                else if (args[1] > maxGifFrameCount) {
                    message.channel.send(`I really don't want to go higher than ${maxGifFrameCount} frames, ${genUtils.getRandomNameInsult(message)}`);
                    return;
                }
                gifFrameCount = args[1];
            }
        }
    }

    else {
        message.channel.send(`Too many parameters, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    genUtils.getMostRecentImageURL(message).then(requestedURL => {

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

                    magikUtils.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
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
    let implodeValues = [];
    for (let i = 0; i < gifFrameCount; i++) {
        let curDeg = 360 * (i / gifFrameCount);
        let newImplodeValue = Math.sin(curDeg * Math.PI / 180.0);
        newImplodeValue -= 0.75;
        newImplodeValue *= 0.5;
        newImplodeValue *= intensity;
        if (newImplodeValue < 0.01 && newImplodeValue > -0.01) newImplodeValue = 0.01;
        implodeValues.push(newImplodeValue);
    }

    let writeRequests = 0;
    for (let i = 0; i < gifFrameCount; i++) {

        writeRequests++;

        gm(`${magikUtils.workshopLoc}/${filename}.png`)
            .implode(implodeValues[i])
            .write(`${magikUtils.workshopLoc}/${filename}-${i}.png`, function (err) {
                if (err) console.error(err);
                
                writeRequests--;

                //If we've written all of the undulated images, delete the source image and generate the gif
                if (writeRequests == 0) {
                    fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, function(err) { if (err) throw err; });

                    magikUtils.generateGif(filename, gifFrameCount, 6, () => {

                        //Once the gif is generated, post it
                        message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.gif`] })
                            .then(function(msg) {
                                fs.unlink(`${magikUtils.workshopLoc}/${filename}.gif`, function(err) { if (err) throw err; });
                                for (let i = 0; i < gifFrameCount; i++) {
                                    fs.unlink(`${magikUtils.workshopLoc}/${filename}-${i}.png`, function(err) { if (err) throw err; });
                                }
                            })
                            .catch(console.error);

                    });

                }
            });

    }
}