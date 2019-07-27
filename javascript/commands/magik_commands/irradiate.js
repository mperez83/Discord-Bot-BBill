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

        let letterValue = genUtils.getArgLetterAndValue(args, message);

        if (!letterValue) {
            return;
        }

        switch(letterValue.letter) {
            //Scale
            case 's':
                scalePercentage = genUtils.verifyNumVal(letterValue.value, minScalePercentage, maxScalePercentage, "Scale Percentage", message);
                if (!scalePercentage) return;
                break;
            
            //Frame Count
            case 'f':
                gifFrameCount = genUtils.verifyIntVal(letterValue.value, minGifFrameCount, maxGifFrameCount, "Frame Count", message);
                if (!gifFrameCount) return;
                break;
            
            //Frame Delay
            case 'd':
                gifFrameDelay = genUtils.verifyIntVal(letterValue.value, minGifFrameDelay, maxGifFrameDelay, "Frame Delay", message);
                if (!gifFrameDelay) return;
                break;

            //Unknown argument
            default:
                message.channel.send(`Unknown parameter '${args[0][1]}', ${genUtils.getRandomNameInsult(message)} (valid rainbow parameters are 'd' and 'm')`);
                return;
        }

    }



    genUtils.getMostRecentImageURL(message).then((requestedURL) => {

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
                .then((response) => {

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
                .catch((err) => {
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
        .size((err, size) => {

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
                    .write(`${magikUtils.workshopLoc}/${filename}-${i}.png`, (err) => {
                        if (err) {
                            //console.error(err);
                            if (!sentError) {
                                message.channel.send(`I do not like that image, so I refuse to continue working on it`);
                                sentError = true;
                                fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, (err) => { if (err) console.error(err); });
                            }
                            return;
                        }
                        
                        writeRequests--;

                        if (writeRequests == 0) {
                            fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, (err) => { if (err) console.error(err); });

                            magikUtils.generateGif(filename, gifFrameCount, gifFrameDelay, () => {

                                message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.gif`] })
                                    .then((msg) => {
                                        fs.unlink(`${magikUtils.workshopLoc}/${filename}.gif`, (err) => { if (err) console.error(err); });
                                        for (let i = 0; i < gifFrameCount; i++) {
                                            fs.unlink(`${magikUtils.workshopLoc}/${filename}-${i}.png`, (err) => { if (err) console.error(err); });
                                        }
                                    })
                                    .catch(console.error);

                            });

                        }
                    });
            }

        });

}