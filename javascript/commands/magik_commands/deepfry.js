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

    //If the user tried to supply some kind of argument, cut that shit right off
    if (args.length > 0) {
        message.channel.send(`no parameters here, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    let foundURL;

    genUtils.getMostRecentImageURL(message).then((requestedURL) => {

        foundURL = requestedURL;

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

                    let msg = `Booting up the fryer`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performDeepFryMagik(message, filename);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "deepfry",
    description: "Deepfries the image",
    usage: "!deepfry",
    example: "!deepfry",
    funFacts: [
        `This command is surprisingly expensive. It involves three separate sharpen operations, which strangely take a large amount of time to do.`,
        `The operation order is as follows: Spread, Sharpen, Noise, Sharpen, Blur, Sharpen.`
    ]
}



function performDeepFryMagik(message, filename) {

    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size((err, size) => {

            if (err) console.error(err);

            let maxRadius = (size.width < size.height) ? Math.floor(size.width / 2) - 1 : Math.floor(size.height / 2) - 1;
            let sharpenAmount = (maxRadius < 100) ? maxRadius : 100;

            gm(`${magikUtils.workshopLoc}/${filename}.png`)
                //.blur(2, 8)
                .spread(4)
                .sharpen(sharpenAmount, sharpenAmount * 0.5)
                .noise("gaussian")
                .sharpen(sharpenAmount, sharpenAmount * 0.5)
                .blur(1, 5)
                .sharpen(sharpenAmount, sharpenAmount * 0.5)
                //.noise("gaussian")
                //.noise("multiplicative")
                //.noise("impulse")
                //.noise("poisson")
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