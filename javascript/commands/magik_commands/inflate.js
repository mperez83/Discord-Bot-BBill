const fs = require("fs");
const gm = require("gm");
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.1;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${genUtils.getRandomNameInsult(message)}`);
        return;
    }

    let inflateAmount = 1;

    //If the user didn't supply a strength level, keep the inflation level normal
    if (args.length == 0) {
        //keep inflateAmount at default value
    }

    //If the user supplied a strength level for the inflation, do tons of bullshit checking
    else if (args.length == 1) {
        if (isNaN(args[0])) {
            message.channel.send(`That's not a fucking number, ${genUtils.getRandomNameInsult(message)}`);
            return;
        }
        else {
            if (args[0] < 0) {
                message.channel.send(`Go use !deflate to do reverse inflates, ${genUtils.getRandomNameInsult(message)}`);
                return;
            }
            else if (args[0] == 0) {
                message.channel.send(`???`);
                return;
            }
            else if (args[0] > 2 && args[0] <= 99) {
                //message.channel.send(`kinky mf huh`);
            }
            else if (args[0] > 99) {
                message.channel.send(`I'm not letting you go higher than 99, ${genUtils.getRandomNameInsult(message)}`);
                return;
            }
            inflateAmount = args[0];
        }
    }

    //If the user supplied more than one parameter, return
    else {
        message.channel.send(`Too many parameters, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    genUtils.getMostRecentImageURL(message).then((returnedURL) => {

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
                .then((response) => {

                    let filename = Date.now();
                    let fileSize = (response.headers['content-length'] / 1000000.0).toFixed(2);

                    let msg = `Starting inflation process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    if (inflateAmount == 69) {
                        message.channel.send({ files: [`./graphics/misc/gotcha.png`] });
                        return;
                    }

                    magikUtils.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performInflateMagik(message, filename, inflateAmount);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "inflate"
}



function performInflateMagik(message, filename, inflateAmount) {

    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .implode(-inflateAmount)
        .write(`${magikUtils.workshopLoc}/${filename}.png`, (err) => {
            if (err) console.error(err);

            message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.png`] })
                .then((msg) => {
                    fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, (err) => { if (err) console.error(err); });
                })
                .catch(console.error);
        });

}