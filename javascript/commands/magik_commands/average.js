const fs = require("fs");
const gm = require("gm");
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.25;
const imageCount = 100;
const implodeIntensity = 1.25;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${genUtils.getRandomNameInsult(message)}`);
        return;
    }

    if (args.length > 0) {
        message.channel.send(`Average doesn't use parameters, ${genUtils.getRandomNameInsult(message)}`);
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

                    let msg = `Starting average process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performAverageMagik(message, filename);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "average",
    description: "Creates 100 copies of the image, applying random implode operations to each one, and then produces one image which is the average of them all",
    usage: "!average",
    example: "!average",
    funFacts: [
        `This is one of those "I only thought about if I could, not about if I should" commands.`
    ]
}



function performAverageMagik(message, filename) {
    let writeRequests = 0;
    for (let i = 0; i < imageCount; i++) {

        writeRequests++;

        gm(`${magikUtils.workshopLoc}/${filename}.png`)
            .implode((Math.random() - 0.75) * implodeIntensity)
            .write(`${magikUtils.workshopLoc}/${filename}-${i}.png`, (err) => {
                if (err) console.error(err);
                
                writeRequests--;

                //If we've written all of the images, average them and post it
                if (writeRequests == 0) {
                    fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, (err) => { if (err) console.error(err); }); //Delete this because we don't need it anymore

                    let avgImg = gm();

                    for (let i = 0; i < imageCount; i++) {
                        avgImg
                            .in(`${magikUtils.workshopLoc}/${filename}-${i}.png`);
                    }

                    avgImg
                        .average()
                        .write(`${magikUtils.workshopLoc}/${filename}.png`, (err) => {
                            if (err) console.error(err);

                            message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.png`] })
                                .then((msg) => {
                                    for (let i = 0; i < imageCount; i++) {
                                        fs.unlink(`${magikUtils.workshopLoc}/${filename}-${i}.png`, (err) => { if (err) console.error(err); });
                                    }
                                    fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, (err) => { if (err) console.error(err); });
                                })
                                .catch(console.error);
                        });
                }
            });

    }
}