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

    genUtils.getMostRecentImageURL(message).then(requestedURL => {

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
                .then(function (response) {

                    let filename = Date.now();
                    let fileSize = (response.headers['content-length'] / 1000000.0).toFixed(2);

                    let msg = `Starting giygas process`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performGiygasMagik(message, filename);
                    });

                })
                .catch(function (err) {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "giygas"
}



function performGiygasMagik(message, filename) {
    //message.channel.send(`??? the image...`);

    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size(function getSize(err, size) {
            if (err) console.error(err);

            let swirlAmount = 360 + (Math.random() * 360);
            if (Math.random() > 0.5) swirlAmount *= -1;

            let maxRadius = (size.width < size.height) ? Math.floor(size.width / 2) - 1 : Math.floor(size.height / 2) - 1;
            let singeAmount = (maxRadius < 99) ? maxRadius : 99;

            gm(`${magikUtils.workshopLoc}/${filename}.png`)
                .swirl(swirlAmount)
                .charcoal(1)
                .charcoal(1)
                .charcoal(1)
                .charcoal(1)
                .charcoal(singeAmount / 2)
                .charcoal(singeAmount)
                .charcoal(singeAmount)
                .charcoal(singeAmount)
                .charcoal(singeAmount)
                .write(`${magikUtils.workshopLoc}/${filename}.png`, function (err) {
                    if (err) console.error(err);

                    message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.png`] })
                        .then(function(msg) {
                            fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, function(err) { if (err) throw err; });
                        })
                        .catch(console.error);
                });
        });
}