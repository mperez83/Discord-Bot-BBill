const fs = require("fs");
const gm = require("gm");
const rp = require("request-promise");

const utilitiesModule = require('../../utilities');
const magikUtilities = require('../../magikUtilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.25;
const imageCount = 100;
const implodeIntensity = 1.25;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${utilitiesModule.getRandomNameInsult(message)}`);
        return;
    }

    if (args.length > 0) {
        message.channel.send(`Average doesn't use parameters, ${utilitiesModule.getRandomNameInsult(message)}`);
        return;
    }



    utilitiesModule.getMostRecentImageURL(message).then(requestedURL => {

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
                .then(function (response) {

                    let filename = Date.now();
                    let fileSize = (response.headers['content-length'] / 1000000.0).toFixed(2);

                    let msg = `Starting average process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtilities.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performAverageMagik(message, filename);
                    });

                })
                .catch(function (err) {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "average"
}



function performAverageMagik(message, filename) {
    //message.channel.send(`Averaging an image..`);

    let writeRequests = 0;
    for (let i = 0; i < imageCount; i++) {

        writeRequests++;

        gm(`./graphics/${filename}.png`)
            .implode((Math.random() - 0.75) * implodeIntensity)
            .write(`./graphics/${filename}-${i}.png`, function (err) {
                if (err) console.error(err);
                
                writeRequests--;

                //If we've written all of the images, average them and post it
                if (writeRequests == 0) {
                    fs.unlink(`./graphics/${filename}.png`, function(err) { if (err) throw err; }); //Delete this because we don't need it anymore

                    let avgImg = gm();

                    for (let i = 0; i < imageCount; i++) {
                        avgImg
                            .in(`./graphics/${filename}-${i}.png`);
                    }

                    avgImg
                        .average()
                        .write(`./graphics/${filename}.png`, function(err){
                            if (err) throw err;

                            message.channel.send({ files: [`./graphics/${filename}.png`] })
                                .then(function(msg) {
                                    for (let i = 0; i < imageCount; i++) {
                                        fs.unlink(`./graphics/${filename}-${i}.png`, function(err) { if (err) throw err; });
                                    }
                                    fs.unlink(`./graphics/${filename}.png`, function(err) { if (err) throw err; });
                                })
                                .catch(console.error);
                        });
                }
            });

    }
}