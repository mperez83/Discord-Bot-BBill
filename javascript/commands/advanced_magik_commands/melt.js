const fs = require("fs");
const gm = require("gm");
const imageMagick = require('gm').subClass({imageMagick: true});
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.25;

const minTargetScalePercentage = 1;
const maxTargetScalePercentage = 99;
const minFrameCount = 10;
const maxFrameCount = 40;
const minFrameDelay = 2;
const maxFrameDelay = 10;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    let targetScalePercentage = 25;
    let frameCount = 24;
    let frameDelay = 6;
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
            case 'c':
                frameCount = genUtils.verifyIntVal(letterValue.value, minFrameCount, maxFrameCount, "Frame Count", message);
                if (!frameCount) return;
                break;
            
            //Frame Delay
            case 'd':
                frameDelay = genUtils.verifyIntVal(letterValue.value, minFrameDelay, maxFrameDelay, "Frame Delay", message);
                if (!frameDelay) return;
                break;
            
            //Ping Pong
            case 'p':
                pingPong = genUtils.verifyBoolVal(letterValue.value, "Ping Pong", message);
                if (!pingPong) return;
                break;
            
            //Sin Wave
            case 'w':
                sinWave = genUtils.verifyBoolVal(letterValue.value, "Sin Wave", message);
                if (!sinWave) return;
                break;

            //Unknown argument
            default:
                message.channel.send(`Unknown parameter '${letterValue.letter}', ${genUtils.getRandomNameInsult(message)} (valid melt parameters are s, c, d, p, and w)`);
                return;
        }

    }

    if (pingPong && frameCount > 20) frameCount = 20;

    let argObj = {
        "targetScalePercentage": targetScalePercentage,
        "frameCount": frameCount,
        "frameDelay": frameDelay,
        "pingPong": pingPong,
        "sinWave": sinWave
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

                    let msg = `Starting melting process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.imWriteAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performMeltMagik(message, filename, argObj);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "melt",
    description: "Melts the image",
    usage: "!melt [-s scale] [-c frameCount] [-d frameDelay] [-p pingPong] [-w sinWave]",
    example: "!melt -s 40 -c 40 -d 4 -p true -w false",
    funFacts: [
        "This is the most complicated Advanced Magik command, having a total of 5 potential parameters.",
        "It was hard to decide if pingPong should be true by default or not. I personally prefer how gifs look with pingPong set to true, but it feels more \
        vanilla to leave it as false unless otherwise specified.",
        "Wave is a fairly hard to notice stat when enabled. I considered removing it when I realized this because it'd never make the difference between a \
        good or bad gif, but there'd be no point as the parameter is optional anyway."
    ]
}



function performMeltMagik(message, filename, argObj) {

    let targetScalePercentage = argObj.targetScalePercentage;
    let frameCount = argObj.frameCount;
    let frameDelay = argObj.frameDelay;
    let pingPong = argObj.pingPong;
    let sinWave = argObj.sinWave;

    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size((err, size) => {

            if (err) console.error(err);

            let ogWidth = size.width;
            let ogHeight = size.height;

            let writeRequests = 0;

            for (let i = 0; i < frameCount; i++) {

                writeRequests++;

                let alpha;
                if (sinWave) {
                    let curDeg = 90 + (180 * (i / frameCount));
                    alpha = (Math.sin(curDeg * Math.PI / 180.0) * 0.5) + 0.5;  //This produces a value between 1 and 0
                    if (alpha < 0.01 && alpha > -0.01) alpha = 0.01;
                }
                else {
                    alpha = 1 - (i / frameCount);
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
                                meltPingPong(message, filename, argObj);
                            }
                            else {

                                fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, (err) => { if (err) console.error(err); });

                                magikUtils.generateGif(filename, frameCount, frameDelay, () => {

                                    message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.gif`] })
                                        .then((msg) => {
                                            fs.unlink(`${magikUtils.workshopLoc}/${filename}.gif`, (err) => { if (err) console.error(err); });
                                            for (let j = 0; j < frameCount; j++) {
                                                fs.unlink(`${magikUtils.workshopLoc}/${filename}-${j}.png`, (err) => { if (err) console.error(err); });
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

function meltPingPong(message, filename, argObj) {

    let targetScalePercentage = argObj.targetScalePercentage;
    let frameCount = argObj.frameCount;
    let frameDelay = argObj.frameDelay;
    let sinWave = argObj.sinWave;

    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size((err, size) => {

            if (err) console.error(err);

            let ogWidth = size.width;
            let ogHeight = size.height;
            let writeRequests = 0;

            for (let i = frameCount; i < (frameCount * 2); i++) {

                writeRequests++;

                let alpha;
                if (sinWave) {
                    let curDeg = 270 + (180 * ((i - frameCount) / frameCount));
                    alpha = (Math.sin(curDeg * Math.PI / 180.0) * 0.5) + 0.5;  //This produces a value between 0 and 1
                    if (alpha < 0.01 && alpha > -0.01) alpha = 0.01;
                }
                else {
                    alpha = ((i - frameCount) / frameCount);
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

                            magikUtils.generateGif(filename, (frameCount * 2), frameDelay, () => {

                                message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.gif`] })
                                    .then((msg) => {
                                        fs.unlink(`${magikUtils.workshopLoc}/${filename}.gif`, (err) => { if (err) console.error(err); });
                                        for (let i = 0; i < (frameCount * 2); i++) {
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