const fs = require("fs");
const gm = require('gm');
const imageMagick = require('gm').subClass({imageMagick: true});
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 1;
const minScalePercentage = 25;
const maxScalePercentage = 200;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    let scalePercentage = 50;

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

                    let msg = `Starting distortion process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.imWriteAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performDistortionMagik(message, filename, scalePercentage);
                    });

                })
                .catch(function (err) {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "distort"
}



function performDistortionMagik(message, filename, scalePercentage) {
    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size(function getSize(err, size) {
            if (err) console.error(err);

            let ogWidth = size.width;
            let ogHeight = size.height;
            let sentError = false;

            imageMagick(`${magikUtils.workshopLoc}/${filename}.png`)
                .in(`-liquid-rescale`, `${ogWidth * (scalePercentage / 100)}x${ogHeight * (scalePercentage / 100)}`)
                .in(`-liquid-rescale`, `${ogWidth}x${ogHeight}`)
                .write(`${magikUtils.workshopLoc}/${filename}.png`, function (err) {
                    if (err) {
                        console.error(err);
                        if (!sentError) {
                            message.channel.send(`I do not like that image, so I refuse to continue working on it`);
                            sentError = true;
                            fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, function(err) { if (err) throw err; });
                        }
                        return;
                    }

                    message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.png`] })
                        .then(function(msg) {
                            fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, function(err) { if (err) throw err; });
                        })
                        .catch(console.error);
                });
        });
}