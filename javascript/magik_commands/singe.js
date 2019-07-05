const gm = require("gm");
const request = require("request");
const rp = require("request-promise");
const utilitiesModule = require('../utilities');
const config = require("../../data/general_data/config.json");



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${utilitiesModule.getRandomNameInsult(message.author)}`);
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
            message.channel.send(`That's not a fucking number, ${utilitiesModule.getRandomNameInsult(message.author)}`);
            return;
        }
        else {
            singeAmount = args[0];
        }
    }

    //If the user supplied more than one parameter, return
    else {
        message.channel.send(`Too many parameters, ${utilitiesModule.getRandomNameInsult(message.author)}`);
        return;
    }



    let foundURL;

    utilitiesModule.getMostRecentImageURL(message).then(returnedURL => {

        foundURL = returnedURL;

        if (!foundURL) {
            return;
        }
        else {
            //Callback method through request
            /*request.head(foundURL, function (err, res, body) {
                console.log('content-type:', res.headers['content-type']);
                console.log('content-length:', res.headers['content-length']);
            });*/

            //Promise method through request-promise
            let options = {
                uri: foundURL,
                resolveWithFullResponse: true
            };

            rp(options)
                .then(function (response) {
                    //console.log(response.headers['content-length']);
                    let fileSize = (response.headers['content-length'] / 1000000.0).toFixed(2);

                    if (fileSize > 2) {
                        message.channel.send(`I don't want to fuck with anything around the size of 2mb, ${utilitiesModule.getRandomNameInsult(message.author)}`);
                        return;
                    }
                    else {
                        //First do a check to make sure the singe amount is less than the max singe amount
                        //Max singe amount depends on the width/height of an image, so we do the .size call
                        //this is where the callback hell bullshit starts
                        gm(request(foundURL))
                            .size(function getSize(err, size) {
                                if (err) console.error(err);
                                else {
                                    let maxSingeAmount = (size.width < size.height) ? Math.floor(size.width / 2) - 1 : Math.floor(size.height / 2) - 1;
                                    if (maxSingeAmount > 99) maxSingeAmount = 99;

                                    //Return if singe amount is higher than the max singe amount
                                    if (singeAmount > maxSingeAmount) {
                                        message.channel.send(`Max singe amount for this image is ${maxSingeAmount}, ${utilitiesModule.getRandomNameInsult(message.author)}\n(max singe amount for any image is half the smaller of the two dimensions, with a ceiling of 99)`);
                                        return;
                                    }

                                    //Perform operation if we're able to
                                    else {
                                        message.channel.send(`alright hold on, singing a ~${fileSize}mb image`);
                                        gm(request(foundURL))
                                            .charcoal(singeAmount)
                                            .write('./graphics/resultImage.png', function (err) {
                                                if (err) console.log(err);
                                                message.channel.send({ files: ["./graphics/resultImage.png"] });
                                            });
                                    }
                                }
                            });
                    }
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