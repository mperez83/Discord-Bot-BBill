const fs = require("fs");
const gm = require("gm");
const rp = require("request-promise");

const genUtils = require('../../command_utilities/general_utilities');
const magikUtils = require('../../command_utilities/magik_utilities');
const config = require("../../../data/general_data/config.json");

const maxFileSize = 0.25;

const enhanceLoops = 4;
const modifiers = {
    BLUR: 0,
    SPREAD: 1,
    SHARPEN: 2,
    NOISE_GAUSSIAN: 3,
    NOISE_MULTIPLICATIVE: 4,
    NOISE_IMPULSE: 5,
    NOISE_POISSON: 6,
    INFLATE: 7,
    SWIRL: 8,
    MONOCHROME: 9,
    MOTION_BLUR: 10,
    NEGATIVE: 11,
    PAINT: 12,
    RAISE: 13,
    WAVE: 14
};



module.exports.run = async (bot, message, args) => {
    
    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${genUtils.getRandomNameInsult(message)}`);
        return;
    }

    //If the user tried to supply some kind of argument, cut that shit right off
    if (args.length > 0) {
        message.channel.send(`No parameters here, ${genUtils.getRandomNameInsult(message)}`);
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

                    let msg = `Enhancing the image`;
                    if (fileSize > 0.25) msg += ` (image is rather large, be patient)`;
                    if (fileSize > maxFileSize) msg += ` (also the image is **${fileSize}mb**, I need to chop it down until it's lower than **${maxFileSize}mb**)`;
                    message.channel.send(msg);

                    magikUtils.writeAndShrinkImage(message, foundURL, filename, maxFileSize, () => {
                        performEnhanceMagik(message, filename);
                    });

                })
                .catch((err) => {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "enhance"
}



function performEnhanceMagik(message, filename) {

    gm(`${magikUtils.workshopLoc}/${filename}.png`)
        .size((err, size) => {
            
            if (err) console.error(err);

            let maxRadius = (size.width < size.height) ? Math.floor(size.width / 2) - 1 : Math.floor(size.height / 2) - 1;
            let sharpenAmount = (maxRadius < 100) ? maxRadius : 100;

            let swirlAmount = 180 + (Math.random() * 360);
            if (Math.random() > 0.5) swirlAmount *= -1;

            let enhancedImage = gm(`${magikUtils.workshopLoc}/${filename}.png`);
            let modifierList = Object.keys(modifiers);

            for (let i = 0; i < enhanceLoops; i++) {
                let randomModifierName = modifierList[Math.floor(Math.random() * modifierList.length)];
                let selectedModifier = modifiers[randomModifierName];

                switch (selectedModifier) {
                    case modifiers.BLUR:
                        enhancedImage.blur(2, 8);
                        break;
                    case modifiers.SPREAD:
                        enhancedImage.spread(4);
                        break;
                    case modifiers.SHARPEN:
                        enhancedImage.sharpen(sharpenAmount, sharpenAmount * 0.5);
                        break;
                    case modifiers.NOISE_GAUSSIAN:
                        enhancedImage.noise("gaussian");
                        break;
                    case modifiers.NOISE_MULTIPLICATIVE:
                        enhancedImage.noise("multiplicative");
                        break;
                    case modifiers.NOISE_IMPULSE:
                        enhancedImage.noise("impulse");
                        break;
                    case modifiers.NOISE_POISSON:
                        enhancedImage.noise("poisson");
                        break;
                    case modifiers.INFLATE:
                        enhancedImage.implode(-2 + (Math.random() * 2.5));
                        break;
                    case modifiers.SWIRL:
                        enhancedImage.swirl(swirlAmount);
                        break;
                    case modifiers.MONOCHROME:
                        enhancedImage.monochrome();
                        break;
                    case modifiers.MOTION_BLUR:
                        enhancedImage.motionBlur(2, 8, 90);
                        break;
                    case modifiers.NEGATIVE:
                        enhancedImage.negative();
                        break;
                    case modifiers.PAINT:
                        enhancedImage.paint(4);
                        break;
                    case modifiers.RAISE:
                        enhancedImage.raise(maxRadius * 0.1, maxRadius * 0.1);
                        break;
                    case modifiers.WAVE:
                        enhancedImage.wave(1, 1);
                        break;
                }
            }

            enhancedImage.write(`${magikUtils.workshopLoc}/${filename}.png`, (err) => {
                if (err) console.error(err);

                message.channel.send({ files: [`${magikUtils.workshopLoc}/${filename}.png`] })
                    .then((msg) => {
                        fs.unlink(`${magikUtils.workshopLoc}/${filename}.png`, (err) => { if (err) console.error(err); });
                    })
                    .catch(console.error);
            });

        });

}