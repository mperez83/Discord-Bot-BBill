const fs = require("fs");
const gm = require("gm");
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.5;

const minIntensity = 1;
const maxIntensity = 90;
const minFrameCount = 2;
const maxFrameCount = 20;
const minFrameDelay = 2;
const maxFrameDelay = 10;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    let intensity = 5;
    let frameCount = 12;
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
                message.channel.send(`Unknown parameter '${letterValue.letter}', ${genUtils.getRandomNameInsult(message)} (valid intensify parameters are i, c, and d)`);
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
                        performIntensifyMagik(message, filename, argObj);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "intensify"
}



function performIntensifyMagik(message, filename, argObj) {

    let intensity = argObj.intensity;
    let frameCount = argObj.frameCount;
    let frameDelay = argObj.frameDelay;

    //Get the size early on, so we don't have to repeatedly later on
    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size((err, size) => {

            if (err) console.error(err);

            let cropWidth = size.width - (size.width * (0.01 * intensity));
            let cropHeight = size.height - (size.height * (0.01 * intensity));

            let writeRequests = 0;
            for (let i = 0; i < frameCount; i++) {

                writeRequests++;

                let cropXOffset = Math.random() * (size.width * (0.01 * intensity));
                let cropYOffset = Math.random() * (size.height * (0.01 * intensity));

                //Actually perform crop manipulations
                gm(`${magikUtils.workshopLoc}/${filename}.png`)
                    .crop(cropWidth, cropHeight, cropXOffset, cropYOffset, false)
                    .repage(cropWidth, cropHeight, 0, 0)
                    .write(`${magikUtils.workshopLoc}/${filename}-${i}.png`, (err) => {
                        if (err) console.error(err);
                        
                        writeRequests--;
        
                        //If we've written all of the intensed images, generate the gif and post it
                        if (writeRequests == 0) {
                            fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, (err) => { if (err) console.error(err); }); //Delete this because we don't need it anymore
        
                            magikUtils.generateGif(filename, frameCount, frameDelay, () => {
        
                                //Once the gif is generated, post it
                                message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.gif`] })
                                    .then((msg) => {
                                        fs.unlink(`${magikUtils.workshopLoc}/${filename}.gif`, (err) => {if (err) console.error(err); });
                                        for (let i = 0; i < frameCount; i++) {
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