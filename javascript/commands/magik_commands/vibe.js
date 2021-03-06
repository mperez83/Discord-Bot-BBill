const fs = require("fs");
const gm = require("gm");
const imageMagick = require("gm").subClass({imageMagick: true});
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

                    let msg = `Starting vibe process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.imWriteAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performVibeMagik(message, filename);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "vibe",
    description: "Produces an image you can vibe to",
    usage: "!vibe",
    example: "!vibe",
    funFacts: [
        `i dont think i know what vibe means`
    ]
}



function performVibeMagik(message, filename) {
    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size((err, size) => {

            if (err) console.error(err);

            let maxRadius = (size.width < size.height) ? Math.floor(size.width / 2) - 1 : Math.floor(size.height / 2) - 1;

            imageMagick()
                .command(`convert`)
                .in(`${magikUtils.workshopLoc}/${filename}.png`)
                .in(`-shade`, `270x15`)
                .in(`-separate`, `-background`, `white`)
                .in(`-compose`, `ModulusAdd`, `-flatten`, `-channel`, `R`, `-combine`, `+channel`)
                .in(`-set`, `colorspace`, `HSB`, `-colorspace`, `RGB`)
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
