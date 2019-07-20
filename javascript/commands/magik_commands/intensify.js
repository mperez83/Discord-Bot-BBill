const fs = require("fs");
const gm = require("gm");
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.5;
const maxIntensity = 90;
const maxFrameDelay = 10;
const maxGifFrameCount = 20;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    let intensity = 5;
    let gifFrameDelay = 5;
    let gifFrameCount = 10;

    if (args.length == 0) {
        //keep gifFrameCount and intensity at their default values
    }

    else if (args.length == 1 || args.length == 2 || args.length == 3) {
        //Intensity
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

        //Frame delay
        if (args.length == 2) {
            if (isNaN(args[1])) {
                message.channel.send(`The provided frame delay isn't a number, ${genUtils.getRandomNameInsult(message)}`);
                return;
            }
            else {
                if (args[1] < 2) {
                    message.channel.send(`A frame delay that's less than 2 is bad, ${genUtils.getRandomNameInsult(message)}`);
                    return;
                }
                else if (args[1] > maxFrameDelay) {
                    message.channel.send(`A delay of ${maxFrameDelay} is too slow, ${genUtils.getRandomNameInsult(message)}`);
                    return;
                }
                gifFrameDelay = args[1];
            }
        }

        //Frame count
        if (args.length == 3) {
            if (isNaN(args[2])) {
                message.channel.send(`The provided frame amount isn't a number, ${genUtils.getRandomNameInsult(message)}`);
                return;
            }
            else {
                if (args[2] < 2) {
                    message.channel.send(`Gifs are composed of more than one frame, ${genUtils.getRandomNameInsult(message)}`);
                    return;
                }
                else if (args[2] > maxGifFrameCount) {
                    message.channel.send(`I really don't want to go higher than ${maxGifFrameCount} frames, ${genUtils.getRandomNameInsult(message)}`);
                    return;
                }
                gifFrameCount = args[2];
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

                    let msg = '';

                    if (intensity == 69) {
                        msg = `heh....... nice.....................................`;
                    }
                    else {
                        msg = `Starting intensify process`;
                        if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                        if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    }
                    message.channel.send(msg);

                    magikUtils.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performIntensifyMagik(message, filename, gifFrameCount, gifFrameDelay, intensity);
                    });

                })
                .catch(function (err) {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "intensify"
}



function performIntensifyMagik(message, filename, gifFrameCount, gifFrameDelay, intensity) {
    //message.channel.send(`Intensifying a gif..`);

    //Get the size early on, so we don't have to repeatedly later on
    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size(function getSize(err, size) {
            if (err) console.error(err);

            let cropWidth = size.width - (size.width * (0.01 * intensity));
            let cropHeight = size.height - (size.height * (0.01 * intensity));

            let writeRequests = 0;
            for (let i = 0; i < gifFrameCount; i++) {

                writeRequests++;

                let cropXOffset = Math.random() * (size.width * (0.01 * intensity));
                let cropYOffset = Math.random() * (size.height * (0.01 * intensity));

                //Actually perform crop manipulations
                gm(`${magikUtils.workshopLoc}/${filename}.png`)
                    .crop(cropWidth, cropHeight, cropXOffset, cropYOffset, false)
                    .repage(cropWidth, cropHeight, 0, 0)
                    .write(`${magikUtils.workshopLoc}/${filename}-${i}.png`, function (err) {
                        if (err) console.error(err);
                        
                        writeRequests--;
        
                        //If we've written all of the intensed images, generate the gif and post it
                        if (writeRequests == 0) {
                            fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, function(err) { if (err) throw err; }); //Delete this because we don't need it anymore
        
                            magikUtils.generateGif(filename, gifFrameCount, gifFrameDelay, () => {
        
                                //Once the gif is generated, post it
                                message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.gif`] })
                                    .then(function(msg) {
                                        fs.unlink(`${magikUtils.workshopLoc}/${filename}.gif`, function(err) {if (err) throw err; });
                                        for (let i = 0; i < gifFrameCount; i++) {
                                            fs.unlink(`${magikUtils.workshopLoc}/${filename}-${i}.png`, function(err) { if (err) throw err; });
                                        }
                                    })
                                    .catch(console.error);
        
                            });
                        }
                    });

            }

        });
}