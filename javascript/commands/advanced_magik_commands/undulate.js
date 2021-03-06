const fs = require("fs");
const gm = require("gm");
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.25;

const minIntensity = 0.1;
const maxIntensity = 10;
const minFrameCount = 5;
const maxFrameCount = 30;
const minFrameDelay = 2;
const maxFrameDelay = 10;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    let intensity = 1;
    let frameCount = 20;
    let frameDelay = 6;

    //Verify parameters
    while (args.length > 0) {

        let letterValue = genUtils.getArgLetterAndValue(args, message);

        if (!letterValue) {
            return;
        }

        switch(letterValue.letter) {
            //Intensity
            case 'i':
                intensity = genUtils.verifyNumVal(letterValue.value, minIntensity, maxIntensity, "Intensity", message);
                if (!intensity) return;
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

            //Unknown argument
            default:
                message.channel.send(`Unknown parameter '${letterValue.letter}', ${genUtils.getRandomNameInsult(message)} (valid undulate parameters are i, c, and d)`);
                return;
        }

    }

    let argObj = {
        "intensity": intensity,
        "frameCount": frameCount,
        "frameDelay": frameDelay
    };



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

                    let msg = `Starting undulate process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performUndulationMagik(message, filename, argObj);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "undulate",
    description: "Undulates the image",
    usage: "!undulate [-i intensity] [-c frameCount] [-d frameDelay]",
    example: "!undulate -i 1.5 -c 15 -d 5",
    funFacts: [
        `The first iteration of undulate involved applying random implode operations to the image, and producing a gif out of it. It had very strange, \
        unsatisfying results, so I updated it to the current form of the command.`
    ]
}



function performUndulationMagik(message, filename, argObj) {

    let intensity = argObj.intensity;
    let frameCount = argObj.frameCount;
    let frameDelay = argObj.frameDelay;

    let implodeValues = [];
    for (let i = 0; i < frameCount; i++) {
        let curDeg = 360 * (i / frameCount);
        let newImplodeValue = Math.sin(curDeg * Math.PI / 180.0);
        newImplodeValue -= 0.75;
        newImplodeValue *= 0.5;
        newImplodeValue *= intensity;
        if (newImplodeValue < 0.01 && newImplodeValue > -0.01) newImplodeValue = 0.01;
        implodeValues.push(newImplodeValue);
    }

    let writeRequests = 0;
    for (let i = 0; i < frameCount; i++) {

        writeRequests++;

        gm(`${magikUtils.workshopLoc}/${filename}.png`)
            .implode(implodeValues[i])
            .write(`${magikUtils.workshopLoc}/${filename}-${i}.png`, (err) => {
                if (err) console.error(err);
                
                writeRequests--;

                //If we've written all of the undulated images, delete the source image and generate the gif
                if (writeRequests == 0) {
                    fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, (err) => { if (err) console.error(err); });

                    magikUtils.generateGif(filename, frameCount, frameDelay, () => {

                        //Once the gif is generated, post it
                        message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.gif`] })
                            .then((msg) => {
                                fs.unlink(`${magikUtils.workshopLoc}/${filename}.gif`, (err) => { if (err) console.error(err); });
                                for (let i = 0; i < frameCount; i++) {
                                    fs.unlink(`${magikUtils.workshopLoc}/${filename}-${i}.png`, (err) => { if (err) console.error(err); });
                                }
                            })
                            .catch(console.error);

                    });

                }
            });

    }

}