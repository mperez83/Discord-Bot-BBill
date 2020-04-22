const fs = require("fs");
const gm = require("gm");
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.25;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${genUtils.getRandomNameInsult(message)}`);
        return;
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

                    let msg = `Starting rorschach process (literally the most expensive command, please be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performRorschachMagik(message, filename);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "rorschach",
    description: "Inkblots an image, and then mirrors the left half onto the right half",
    usage: "!rorschach",
    example: "!rorschach",
    funFacts: [
        `These are my favorite image manipulations.`
    ]
}



function performRorschachMagik(message, filename) {

    // Inkblot the image
    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size((err, size) => {
            if (err) console.error(err);

            let maxSingeAmount = (size.width < size.height) ? Math.floor(size.width / 2) - 1 : Math.floor(size.height / 2) - 1;
            let singeAmount = (maxSingeAmount < 99) ? maxSingeAmount : 99;

            gm(`${magikUtils.workshopLoc}/${filename}.png`)
                .charcoal(1)
                .charcoal(1)
                .charcoal(1)
                .charcoal(1)
                .charcoal(singeAmount / 2)
                .charcoal(singeAmount)
                .charcoal(singeAmount)
                .charcoal(singeAmount)
                .charcoal(singeAmount)
                .write(`${magikUtils.workshopLoc}/${filename}.png`, (err) => {
                    if (err) console.error(err);

                    let writeRequests = 2;

                    // Write left half
                    gm(`${magikUtils.workshopLoc}/${filename}.png`)
                        .crop(50, 100, 0, 0, true)
                        .write(`${magikUtils.workshopLoc}/${filename}_L.png`, (err) => {
                            if (err) console.error(err);

                            writeRequests--;
                            if (writeRequests == 0) combineAndPost(message, filename);
                        });

                    // Write right half
                    gm(`${magikUtils.workshopLoc}/${filename}.png`)
                        .crop(50, 100, 0, 0, true)
                        .flop()
                        .write(`${magikUtils.workshopLoc}/${filename}_R.png`, (err) => {
                            if (err) console.error(err);

                            writeRequests--;
                            if (writeRequests == 0) combineAndPost(message, filename);
                        });
                });
        });
        
}

function combineAndPost(message, filename) {

    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size((err, size) => {

            if (err) console.error(err);

            let halfWidth = size.width * 0.5;

            gm()
                .in(`-page`, `+0+0`)
                .in(`${magikUtils.workshopLoc}/${filename}_L.png`)
                .in(`-page`, `+${halfWidth}+0`)
                .in(`${magikUtils.workshopLoc}/${filename}_R.png`)

                .background("transparent")
                .mosaic()
                .write(`${magikUtils.workshopLoc}/${filename}.png`, (err) => {
                    if (err) console.error(err);

                    fs.unlink(`${magikUtils.workshopLoc}/${filename}_L.png`, (err) => { if (err) console.error(err); });
                    fs.unlink(`${magikUtils.workshopLoc}/${filename}_R.png`, (err) => { if (err) console.error(err); });

                    message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.png`] })
                        .then((msg) => {
                            fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, (err) => { if (err) console.error(err); });
                        })
                        .catch(console.error);
                });

        });

}
