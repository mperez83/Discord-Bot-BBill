const fs = require("fs");
const gm = require("gm");
const imageMagick = require("gm").subClass({imageMagick: true});
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.25;

const minGifFrameDelay = 2;
const maxGifFrameDelay = 10;
const minMidwayFrames = 1;
const maxMidwayFrames = 8;

const iMagikColors = [
    "red", "orange", "yellow", "green", "blue", "purple"
];



module.exports.run = async (bot, message, args) => {

    try {
        if (!genUtils.verifyWhitelistCommandCall(message, "rainbow")) return;
    }
    catch (err) {
        console.error(err);
    }

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    let gifFrameDelay = 6;
    let midwayFrames = 3;

    //Verify parameters
    while (args.length > 0) {

        let letterValue = genUtils.getArgLetterAndValue(args, message);

        if (!letterValue) {
            return;
        }

        switch(letterValue.letter) {
            //Delay
            case 'd':
                gifFrameDelay = genUtils.verifyIntVal(letterValue.value, minGifFrameDelay, maxGifFrameDelay, "Frame Delay", message);
                if (!gifFrameDelay) return;
                break;
            
            //Midway Frames
            case 'm':
                midwayFrames = genUtils.verifyIntVal(letterValue.value, minMidwayFrames, maxMidwayFrames, "Midway Frames", message);
                if (!midwayFrames) return;
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

                    let msg = `Starting rainbow magik (this is literally the most expensive command, please be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.imWriteAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        generateBaseImages(message, filename, gifFrameDelay, midwayFrames);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "rainbow",
    description: "Makes the image cycle through the colors of the rainbow",
    usage: "!rainbow [-d frameDelay] [-m midwayFrames]",
    example: "!rainbow -d 4 -m 5",
    funFacts: [
        "This is one of my favorite commands. It's unfortunate that it's too dangerous to allow others to use, as it generates a LOT of \
        images in order to compose a smooth transition throughout the rainbow.",
        "Rainbow starts by first generating six images of each main color. It then generates sub images that represent the midway points between \
        those six images, slowly transitioning from one color to the next.",
        "Rainbow is the most expensive command because of how large the amount of pictures it can generate becomes. With a midwayFrames value of 4, \
        four smooth-transition images are generated between the already existing six images. 24 + 4 = 28 images are generated, each one utilizing a \
        complex operation process to color it in the first place."
    ]
}



//This generates a grayscale image, and then generates six colored images out of it that are used for dissolving later
function generateBaseImages(message, filename, gifFrameDelay, midwayFrames) {
    imageMagick()
        .command(`convert`)
        .in(`${magikUtils.workshopLoc}/${filename}.png`)
        .in(`-colorspace`, `gray`, `-sigmoidal-contrast`, `10,40%`)
        .write(`${magikUtils.workshopLoc}/${filename}.png`, (err) => {
            if (err) console.error(err);

            let writeRequests = 0;
            for (let i = 0; i < iMagikColors.length; i++) {

                writeRequests++;

                imageMagick()
                    .command(`convert`)
                    .in(`${magikUtils.workshopLoc}/${filename}.png`)
                    .in(`-fill`, `${iMagikColors[i]}`, `-tint`, `100`)
                    .write(`${magikUtils.workshopLoc}/${filename}-${iMagikColors[i]}.png`, (err) => {
                        if (err) console.error(err);
                        
                        writeRequests--;

                        if (writeRequests == 0) {
                            fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, (err) => { if (err) console.error(err); });

                            rainbowDissolveMagik(message, filename, gifFrameDelay, midwayFrames);
                        }
                    });
        }

    });
}

function rainbowDissolveMagik(message, filename, gifFrameDelay, midwayFrames) {
    let writeRequests = 0;
    let counter = 0;

    for (let i = 0; i < iMagikColors.length; i++) {

        let colorOne = iMagikColors[i];
        let colorTwo = (i != (iMagikColors.length - 1)) ? iMagikColors[i + 1] : iMagikColors[0];

        for (let j = 0; j < midwayFrames; j++) {

            writeRequests++;
            counter++;

            let dissolveAmount = (100 / midwayFrames) * (midwayFrames - j);

            imageMagick()
                .command(`composite`)
                .in(`-dissolve`, `${dissolveAmount}%`)
                .in(`${magikUtils.workshopLoc}/${filename}-${colorOne}.png`)
                .in(`${magikUtils.workshopLoc}/${filename}-${colorTwo}.png`)
                .write(`${magikUtils.workshopLoc}/${filename}-${counter-1}.png`, (err) => {
                    if (err) console.error(err);

                    writeRequests--;

                    if (writeRequests == 0) {

                        magikUtils.generateGif(filename, counter, gifFrameDelay, () => {

                            message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.gif`] })
                                .then((msg) => {

                                    //Delete the gif
                                    fs.unlink(`${magikUtils.workshopLoc}/${filename}.gif`, (err) => { if (err) console.error(err); });

                                    //Delete the base colored images
                                    for (let k = 0; k < iMagikColors.length; k++) {
                                        fs.unlink(`${magikUtils.workshopLoc}/${filename}-${iMagikColors[k]}.png`, (err) => { if (err) console.error(err); });
                                    }

                                    //Delete ALL of the dissolve images
                                    for (let k = 0; k < counter; k++) {
                                        fs.unlink(`${magikUtils.workshopLoc}/${filename}-${k}.png`, (err) => { if (err) console.error(err); });
                                    }

                                })
                                .catch(console.error);

                        });

                    }
                });
        }

    }
}