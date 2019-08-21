const fs = require("fs");
const imageMagick = require('gm').subClass({imageMagick: true});
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 3;



module.exports.run = async (bot, message, args) => {

    //Check if the user is whitelisted as an admin
    try {
        if (!genUtils.verifyWhitelistCommandCall(message, "admin")) return;
    }
    catch (err) {
        console.error(err);
    }

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${genUtils.getRandomNameInsult(message)}`);
        return;
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
                .then((response) => {

                    let filename = Date.now();
                    let fileSize = (response.headers['content-length'] / 1000000.0).toFixed(2);

                    let msg = `Starting magik process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performIMagik(message, filename);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "imagik",
    description: "Saves the image to disk with ImageMagick, and reposts it",
    usage: "!imagik",
    example: "!imagik",
    funFacts: [
        `This is an admin command! You probably are not able to use it.`,
        `This command is bad. It doesn't do anything funny to the image; it just saves the image to disk with ImageMagick, and then reuploads it. The \
        purpose of this command was to learn how to use ImageMagick in lieu of GraphicsMagick.`
    ]
}



function performIMagik(message, filename) {
    imageMagick(`${magikUtils.workshopLoc}/${filename}.png`)
        .write(`${magikUtils.workshopLoc}/${filename}.png`, (err) => {
            if (err) console.error(err);

            message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.png`] })
                .then((msg) => {
                    fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, (err) => { if (err) console.error(err); });
                })
                .catch(console.error);
        });
}