const fs = require("fs");
const gm = require("gm");
const imageMagick = require('gm').subClass({imageMagick: true});
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.001;



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

                    let msg = `Starting magik process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performMagik(message, filename);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "magik",
    description: "Applies magik to the image",
    usage: "!magik",
    example: "!magik",
    funFacts: [
        `This is the first magik command ever implemented. Originally, it didn't even perform magik; it just posted a picture of a dog. It stayed that way for a very \
        long time, waiting for the day I discovered how to utilize GraphicsMagick.`,
        `Magik was initially used as a template for all future magik commands. If ever I wanted to add a new one, I'd copy and paste magik.js into a new document.`,
        `Magik was supposed to change frequently, to reflect my growing knowledge of how to use GraphicsMagick, but eventually I settled on it just being a command that \
        reduces the size of an image to less than one kilobyte.`
    ]
}



function performMagik(message, filename) {

    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size((err, size) => {

            if (err) console.error(err);

            let maxRadius = (size.width < size.height) ? Math.floor(size.width / 2) - 1 : Math.floor(size.height / 2) - 1;

            gm(`${magikUtils.workshopLoc}/${filename}.png`)
                .write(`${magikUtils.workshopLoc}/${filename}.png`, (err) => {
                    if (err) console.error(err);

                    message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.png`] })
                        .then((msg) => {
                            fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, (err) => { if (err) console.error(err); });
                        })
                        .catch(console.error);
                });

        });

}