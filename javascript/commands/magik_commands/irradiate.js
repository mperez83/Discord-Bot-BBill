const fs = require("fs");
const gm = require("gm");
const imageMagick = require('gm').subClass({imageMagick: true});
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.5;
const minScalePercentage = 25;
const maxScalePercentage = 200;
const minGifFrameCount = 2;
const maxGifFrameCount = 20;
const minGifFrameDelay = 2;
const maxGifFrameDelay = 10;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    let scalePercentage = 50;
    let gifFrameCount = 12;
    let gifFrameDelay = 6;

    //Verify parameters
    while (args.length > 0) {

        if ((args.length % 2) != 0) {
            message.channel.send(`Invalid argument format, ${genUtils.getRandomNameInsult(message)} (there should be an even amount of inputs)`);
            return;
        }

        if (args[0][0] != '-') {
            message.channel.send(`Invalid argument provided, ${genUtils.getRandomNameInsult(message)} (the argument you want to provide needs to start with a hyphen)`);
            return;
        }
        else {

            if (args[0].length != 2) {
                message.channel.send(`Invalid argument provided, ${genUtils.getRandomNameInsult(message)} (the start of an argument should be a hyphen and a letter, e.g. -s)`);
                return;
            }

            let result;

            switch(args[0][1]) {
                //Scale
                case 's':
                    result = genUtils.verifyNumVal(args[1], minScalePercentage, maxScalePercentage);
                    if (result == 0) scalePercentage = args[1];
                    else if (result == 1) { message.channel.send(`Provided scale value isn't a number, ${genUtils.getRandomNameInsult(message)}`); return; }
                    else if (result == 2) { message.channel.send(`Provided scale value must be equal to or greater than ${minScalePercentage}, ${genUtils.getRandomNameInsult(message)}`); return; }
                    else if (result == 3) { message.channel.send(`Provided scale value must be equal to or less than ${maxScalePercentage}, ${genUtils.getRandomNameInsult(message)}`); return; }
                    break;

                //Frame count
                case 'f':
                    result = genUtils.verifyNumVal(args[1], minGifFrameCount, maxGifFrameCount);
                    if (result == 0) gifFrameCount = args[1];
                    else if (result == 1) { message.channel.send(`Provided frame count value isn't a number, ${genUtils.getRandomNameInsult(message)}`); return; }
                    else if (result == 2) { message.channel.send(`Provided frame count value must be equal to or greater than ${minGifFrameCount}, ${genUtils.getRandomNameInsult(message)}`); return; }
                    else if (result == 3) { message.channel.send(`Provided frame count value must be equal to or less than ${maxGifFrameCount}, ${genUtils.getRandomNameInsult(message)}`); return; }
                    break;
                
                //Delay
                case 'd':
                    result = genUtils.verifyNumVal(args[1], minGifFrameDelay, maxGifFrameDelay);
                    if (result == 0) gifFrameDelay = args[1];
                    else if (result == 1) { message.channel.send(`Provided frame delay value isn't a number, ${genUtils.getRandomNameInsult(message)}`); return; }
                    else if (result == 2) { message.channel.send(`Provided frame delay value must be equal to or greater than ${minGifFrameCount}, ${genUtils.getRandomNameInsult(message)}`); return; }
                    else if (result == 3) { message.channel.send(`Provided frame delay value must be equal to or less than ${maxGifFrameCount}, ${genUtils.getRandomNameInsult(message)}`); return; }
                    break;

                //Unknown argument
                default:
                    message.channel.send(`Unknown parameter '${args[0][1]}', ${genUtils.getRandomNameInsult(message)} (valid irradiate parameters are 's', 'f', and 'd')`);
                    return;
            }

        }
        args.splice(0, 2);

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

                    let msg = `Starting irradiating process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.imWriteAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performIrradiationMagik(message, filename, scalePercentage, gifFrameCount, gifFrameDelay);
                    });

                })
                .catch(function (err) {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "irradiate"
}



function performIrradiationMagik(message, filename, scalePercentage, gifFrameCount, gifFrameDelay) {
    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size(function getSize(err, size) {
            if (err) console.error(err);

            let ogWidth = size.width;
            let ogHeight = size.height;
            let writeRequests = 0;
            let sentError = false;

            for (let i = 0; i < gifFrameCount; i++) {

                writeRequests++;
                let scaleModifier = (scalePercentage - 5 + (Math.random() * 10)) / 100;
                let newWidth = ogWidth * scaleModifier;
                let newHeight = ogHeight * scaleModifier;

                imageMagick(`${magikUtils.workshopLoc}/${filename}.png`)
                    .in(`-liquid-rescale`, `${newWidth}x${newHeight}`)
                    .in(`-liquid-rescale`, `${ogWidth}x${ogHeight}`)
                    .write(`${magikUtils.workshopLoc}/${filename}-${i}.png`, function (err) {
                        if (err) {
                            //console.error(err);
                            if (!sentError) {
                                message.channel.send(`I do not like that image, so I refuse to continue working on it`);
                                sentError = true;
                                fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, function(err) { if (err) throw err; });
                            }
                            return;
                        }
                        
                        writeRequests--;

                        if (writeRequests == 0) {
                            fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, function(err) { if (err) throw err; });

                            magikUtils.generateGif(filename, gifFrameCount, gifFrameDelay, () => {

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

        });
}