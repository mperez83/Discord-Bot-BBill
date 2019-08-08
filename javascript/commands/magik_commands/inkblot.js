const fs = require("fs");
const gm = require("gm");
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.5;



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${genUtils.getRandomNameInsult(message)}`);
        return;
    }

    //If the user tried to supply some kind of argument, cut that shit right off
    if (args.length > 0) {
        message.channel.send(`Inkblot doesn't use parameters, ${genUtils.getRandomNameInsult(message)}`);
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

                    let msg = `Starting inkblot process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performInkblotMagik(message, filename);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "inkblot",
    description: "Turns the image into an inkblot",
    usage: "!inkblot",
    example: "!inkblot",
    funFacts: [
        "Kordell patented the series of operations required to do an inkblot. It required a bit of convincing to allow its usage in Big Bill.",
        "The series of operations inkblot performs is as follows: Small singe, small singe, small singe, small singe, \
        medium singe, large singe, large singe, large singe, large singe."
    ]
}



function performInkblotMagik(message, filename) {

    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size((err, size) => {

            if (err) console.error(err);

            let maxSingeAmount = (size.width < size.height) ? Math.floor(size.width / 2) - 1 : Math.floor(size.height / 2) - 1;
            let singeAmount = (maxSingeAmount < 99) ? maxSingeAmount : 99;

            gm(`${magikUtils.workshopLoc}/${filename}.png`)
                .charcoal(1)
                .charcoal(1)
                .charcoal(1)
                .charcoal(1)
                .charcoal(singeAmount / 2)
                .charcoal(singeAmount)
                .charcoal(singeAmount)
                .charcoal(singeAmount)
                .charcoal(singeAmount)
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