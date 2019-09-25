const fs = require("fs");
const gm = require("gm");
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 2;



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

                    let msg = `Starting bottob process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performObaboMagik(message, filename);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "bottob",
    description: "Cuts the image in half, and reflects the bottom half of the image onto the top half",
    usage: "!bottob",
    example: "!bottob",
    funFacts: [
        `Requested by Kordell!`
    ]
}



function performObaboMagik(message, filename) {

    let writeRequests = 2;

    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size((err, size) => {

            if (err) console.error(err);

            //Write top half
            gm(`${magikUtils.workshopLoc}/${filename}.png`)
                .crop(100, 50, 0, size.height * 0.5, true)
                .flip()
                .write(`${magikUtils.workshopLoc}/${filename}_T.png`, (err) => {
                    if (err) console.error(err);

                    writeRequests--;
                    if (writeRequests == 0) combineAndPost(message, filename);
                });

            //Write bottom half
            gm(`${magikUtils.workshopLoc}/${filename}.png`)
                .crop(100, 50, 0, size.height * 0.5, true)
                .write(`${magikUtils.workshopLoc}/${filename}_B.png`, (err) => {
                    if (err) console.error(err);

                    writeRequests--;
                    if (writeRequests == 0) combineAndPost(message, filename);
                });

        });
        
}

function combineAndPost(message, filename) {

    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size((err, size) => {

            if (err) console.error(err);

            let halfHeight = size.height * 0.5;

            gm()
                .in(`-page`, `+0+0`)
                .in(`${magikUtils.workshopLoc}/${filename}_T.png`)
                .in(`-page`, `+0+${halfHeight}`)
                .in(`${magikUtils.workshopLoc}/${filename}_B.png`)

                .background("transparent")
                .mosaic()
                .write(`${magikUtils.workshopLoc}/${filename}.png`, (err) => {
                    if (err) console.error(err);

                    fs.unlink(`${magikUtils.workshopLoc}/${filename}_T.png`, (err) => { if (err) console.error(err); });
                    fs.unlink(`${magikUtils.workshopLoc}/${filename}_B.png`, (err) => { if (err) console.error(err); });

                    message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.png`] })
                        .then((msg) => {
                            fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, (err) => { if (err) console.error(err); });
                        })
                        .catch(console.error);
                });

        });

}