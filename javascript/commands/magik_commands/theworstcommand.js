const fs = require("fs");
const gm = require("gm");
const imageMagick = require("gm").subClass({imageMagick: true});
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 1;



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

                    let msg = `Starting the process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.imWriteAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performRainbowMagik(message, filename);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "theworstcommand",
    description: "Turns the image into a Super Mario 64 painting",
    usage: "!theworstcommand",
    example: "!theworstcommand",
    funFacts: [
        "This was one of the most complicated commands to implement, involving procedurely generated plasma fractals and modular framing. It produces one of the \
        most boring results, though, which is why the command has the alias it has.",
        "One somewhat fun use of the command is to do a lot of theworstcommand calls in a row on the same image. This causes the borders to create a 3D effect \
        on the image, because each new border is larger than the previous.",
        "This is one of a few secret commands Big Bill currently has. It isn't listed on his GitHub page."
    ]
}



function performRainbowMagik(message, filename) {

    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size((err, size) => {

            if (err) console.error(err);

            let frameWidth = size.width * 0.1;

            imageMagick()
                .command(`convert`)
                .in(`${magikUtils.workshopLoc}/${filename}.png`)
                .in(`-matte`, `-mattecolor`, `#CCC6`, `-frame`, `${frameWidth}x${frameWidth}+${frameWidth * 0.3}+${frameWidth * 0.3}`)
                .in(`(`, `-size`, `${size.width + (frameWidth * 2)}x${size.height + (frameWidth * 2)}`, `plasma:fractal`, `-normalize`, `-blur`, `0x1`, `)`)
                .in(`-compose`, `DstOver`, `-composite`)
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