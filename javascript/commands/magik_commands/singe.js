const fs = require("fs");
const gm = require("gm");
const rp = require("request-promise");

const utilitiesModule = require('../../utilities');
const magikUtilities = require('../../magikUtilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 2;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${utilitiesModule.getRandomNameInsult(message)}`);
        return;
    }

    let singeAmount = 1;

    //If the user didn't supply a strength level, keep the singe level normal
    if (args.length == 0) {
        //keep singeAmount at default value
    }

    //If the user supplied a strength level for the singe, do some checks
    else if (args.length == 1) {
        if (isNaN(args[0])) {
            message.channel.send(`The provided singe amount isn't a number, ${utilitiesModule.getRandomNameInsult(message)}`);
            return;
        }
        else {
            singeAmount = args[0];
        }
    }

    //If the user supplied more than one parameter, return
    else {
        message.channel.send(`Too many parameters, ${utilitiesModule.getRandomNameInsult(message)}`);
        return;
    }



    utilitiesModule.getMostRecentImageURL(message).then(returnedURL => {

        let foundURL = returnedURL;

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

                    let msg = `Starting singe process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtilities.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performSingeMagik(message, filename, singeAmount);
                    });

                })
                .catch(function (err) {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "singe"
}



function performSingeMagik(message, filename, singeAmount) {
    //message.channel.send(`Singing the image...`);

    gm(`./graphics/${filename}.png`)
        .size(function getSize(err, size) {
            if (err) console.error(err);

            let maxSingeAmount = (size.width < size.height) ? Math.floor(size.width / 2) - 1 : Math.floor(size.height / 2) - 1;
            let finalSingeAmount = (maxSingeAmount < singeAmount) ? maxSingeAmount : singeAmount;

            gm(`./graphics/${filename}.png`)
                .charcoal(finalSingeAmount)
                .write(`./graphics/${filename}.png`, function (err) {
                    if (err) console.error(err);

                    message.channel.send({ files: [`./graphics/${filename}.png`] })
                        .then(function(msg) {
                            fs.unlink(`./graphics/${filename}.png`, function(err) { if (err) throw err; });
                        })
                        .catch(console.error);
                });
        });
}