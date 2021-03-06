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
        message.channel.send(`Spiders don't need parameters, ${genUtils.getRandomNameInsult(message)}`);
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

                    let msg = `Starting spider process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performSpiderMagik(message, filename);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "spider",
    description: "Creates an eldritch spider from the image",
    usage: "!spider",
    example: "!spider",
    funFacts: [
        `Spider is incredibly similar to inkblot. The difference is that spider implodes the image by a random amount right off the bat, and then does \
        everything inkblot does. Spider does throw in some cheeky blurs, though.`,
        `This is one of my favorite commands. You can get some REALLY good eldritch spiders sometimes.`
    ]
}



function performSpiderMagik(message, filename) {

    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size((err, size) => {

            if (err) console.error(err);

            let maxSingeAmount = (size.width < size.height) ? Math.floor(size.width / 2) - 1 : Math.floor(size.height / 2) - 1;
            let singeAmount = (maxSingeAmount < 99) ? maxSingeAmount : 99;

            gm(`${magikUtils.workshopLoc}/${filename}.png`)
                .implode(1 + (Math.random() * 0.5))
                .implode(-3 + (Math.random() * -3))
                .charcoal(1)
                .charcoal(1)
                .charcoal(1)
                .charcoal(1)
                .charcoal(singeAmount)
                .blur(singeAmount)
                .blur(singeAmount)
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