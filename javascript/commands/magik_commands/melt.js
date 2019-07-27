const fs = require("fs");
const gm = require("gm");
const imageMagick = require('gm').subClass({imageMagick: true});
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.25;

const minTargetScalePercentage = 1;
const maxTargetScalePercentage = 90;
const minGifFrameCount = 10;
const maxGifFrameCount = 40;
const minGifFrameDelay = 2;
const maxGifFrameDelay = 10;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    let targetScalePercentage = 25;
    let gifFrameCount = 24;
    let gifFrameDelay = 6;
    let pingPong = false;
    let sinWave = false;

    //Verify parameters
    while (args.length > 0) {

        let letterValue = genUtils.getArgLetterAndValue(args, message);

        if (!letterValue) {
            return;
        }

        switch(letterValue.letter) {
            //Scale
            case 's':
                targetScalePercentage = genUtils.verifyNumVal(letterValue.value, minTargetScalePercentage, maxTargetScalePercentage, "Target Scale Percentage", message);
                if (!targetScalePercentage) return;
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
            
            case 'p':
                pingPong = genUtils.verifyBoolVal(letterValue.value, "Ping Pong", message);
                if (!pingPong) return;
                break;
            
            case 'w':
                sinWave = genUtils.verifyBoolVal(letterValue.value, "Sin Wave", message);
                if (!sinWave) return;
                break;

            //Unknown argument
            default:
                message.channel.send(`Unknown parameter '${args[0][1]}', ${genUtils.getRandomNameInsult(message)} (valid rainbow parameters are 'd' and 'm')`);
                return;
        }

    }

    if (pingPong && gifFrameCount > 20) gifFrameCount = 20;



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

                    let msg = `Starting melting process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.imWriteAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performMeltMagik(message, filename, targetScalePercentage, gifFrameCount, gifFrameDelay, pingPong, sinWave);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "melt"
}



function performMeltMagik(message, filename, targetScalePercentage, gifFrameCount, gifFrameDelay, pingPong, sinWave) {

    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size((err, size) => {

            if (err) console.error(err);

            let ogWidth = size.width;
            let ogHeight = size.height;

            let writeRequests = 0;

            for (let i = 0; i < gifFrameCount; i++) {

                writeRequests++;

                let alpha;
                if (sinWave) {
                    let curDeg = 90 + (180 * (i / gifFrameCount));
                    alpha = (Math.sin(curDeg * Math.PI / 180.0) * 0.5) + 0.5;  //This produces a value between 1 and 0
                    if (alpha < 0.01 && alpha > -0.01) alpha = 0.01;
                }
                else {
                    alpha = 1 - (i / gifFrameCount);
                }
                
                let scaleModifier = genUtils.lerp(targetScalePercentage / 100, 1, alpha);

                let newWidth = ogWidth * scaleModifier;
                let newHeight = ogHeight * scaleModifier;

                imageMagick(`${magikUtils.workshopLoc}/${filename}.png`)
                    .in(`-liquid-rescale`, `${newWidth}x${newHeight}`)
                    .in(`-liquid-rescale`, `${ogWidth}x${ogHeight}`)
                    .write(`${magikUtils.workshopLoc}/${filename}-${i}.png`, (err) => {

                        if (err) console.error(err);
                        
                        writeRequests--;
                        if (writeRequests == 0) {

                            if (pingPong) {
                                meltPingPong(message, filename, targetScalePercentage, gifFrameCount, gifFrameDelay, sinWave);
                            }
                            else {

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

                        }

                    });
            }

        });

}

function meltPingPong(message, filename, targetScalePercentage, gifFrameCount, gifFrameDelay, sinWave) {

    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size((err, size) => {

            if (err) console.error(err);

            let ogWidth = size.width;
            let ogHeight = size.height;
            let writeRequests = 0;

            for (let i = gifFrameCount; i < (gifFrameCount * 2); i++) {

                writeRequests++;

                let alpha;
                if (sinWave) {
                    let curDeg = 270 + (180 * ((i - gifFrameCount) / gifFrameCount));
                    alpha = (Math.sin(curDeg * Math.PI / 180.0) * 0.5) + 0.5;  //This produces a value between 0 and 1
                    if (alpha < 0.01 && alpha > -0.01) alpha = 0.01;
                }
                else {
                    alpha = ((i - gifFrameCount) / gifFrameCount);
                }
                
                let scaleModifier = genUtils.lerp(targetScalePercentage / 100, 1, alpha);

                let newWidth = ogWidth * scaleModifier;
                let newHeight = ogHeight * scaleModifier;

                imageMagick(`${magikUtils.workshopLoc}/${filename}.png`)
                    .in(`-liquid-rescale`, `${newWidth}x${newHeight}`)
                    .in(`-liquid-rescale`, `${ogWidth}x${ogHeight}`)
                    .write(`${magikUtils.workshopLoc}/${filename}-${i}.png`, (err) => {

                        if (err) console.error(err);
                        
                        writeRequests--;
                        if (writeRequests == 0) {

                            fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, (err) => { if (err) console.error(err); });

                            magikUtils.generateGif(filename, (gifFrameCount * 2), gifFrameDelay, () => {

                                message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.gif`] })
                                    .then((msg) => {
                                        fs.unlink(`${magikUtils.workshopLoc}/${filename}.gif`, (err) => { if (err) console.error(err); });
                                        for (let i = 0; i < (gifFrameCount * 2); i++) {
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