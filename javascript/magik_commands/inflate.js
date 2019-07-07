const fs = require("fs");
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

    let inflateAmount = 1;
    let appendSuggestion = false;

    //If the user didn't supply a strength level, keep the inflation level normal
    if (args.length == 0) {
        //keep inflateAmount at default value
    }

    //If the user supplied a strength level for the inflation, do tons of bullshit checking
    else if (args.length == 1) {
        if (isNaN(args[0])) {
            message.channel.send(`That's not a fucking number, ${utilitiesModule.getRandomNameInsult(message.author)}`);
            return;
        }
        else {
            if (args[0] < 0) {
                message.channel.send(`Go use !deflate to do reverse inflates, ${utilitiesModule.getRandomNameInsult(message.author)}`);
                return;
            }
            else if (args[0] == 0) {
                message.channel.send(`???`);
                return;
            }
            else if (args[0] > 2 && args[0] <= 99) {
                appendSuggestion = true;
                //message.channel.send(`kinky mf huh`);
            }
            else if (args[0] > 99) {
                message.channel.send(`I'm not letting you go higher than 99, ${utilitiesModule.getRandomNameInsult(message.author)}`);
                return;
            }
            inflateAmount = args[0];
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
            let options = {
                uri: foundURL,
                resolveWithFullResponse: true
            };

            rp(options)
                .then(function (response) {
                    let fileSize = (response.headers['content-length'] / 1000000.0).toFixed(2);

                    if (fileSize > 2) {
                        message.channel.send(`I don't want to fuck with anything around the size of 2mb, ${utilitiesModule.getRandomNameInsult(message.author)}`);
                        return;
                    }
                    else {
                        let msg = `alright hold on, inflating a ~${fileSize}mb image`;
                        if (appendSuggestion) msg += ` (for best results, keep inflation strength less than 2)`;
                        message.channel.send(msg);
                        
                        let filename = Date.now();

                        gm(request(foundURL))
                            .implode(-inflateAmount)
                            .write(`./graphics/${filename}.png`, function (err) {
                                if (err) console.error(err);
                                if (inflateAmount == 69) {
                                    message.channel.send({ files: [`./graphics/misc/gotcha.png`] })
                                        .then(function(msg) {
                                            fs.unlink(`./graphics/${filename}.png`, function(err) { if (err) throw err; });
                                        })
                                        .catch(console.error);
                                }
                                else {
                                    message.channel.send({ files: [`./graphics/${filename}.png`] })
                                        .then(function(msg) {
                                            fs.unlink(`./graphics/${filename}.png`, function(err) { if (err) throw err; });
                                        })
                                        .catch(console.error);
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
    name: "inflate"
}