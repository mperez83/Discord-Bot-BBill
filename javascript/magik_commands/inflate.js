const gm = require("gm");
const request = require("request");
const rp = require("request-promise");
const utilitiesModule = require('../utilities');
const config = require("../../data/general_data/config.json");



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${utilitiesModule.getRandomNameInsult()}`);
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
            message.channel.send(`That's not a fucking number, ${utilitiesModule.getRandomNameInsult()}`);
            return;
        }
        else {
            if (args[0] < 0) {
                message.channel.send(`Go use !deflate to do reverse inflates, ${utilitiesModule.getRandomNameInsult()}`);
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
                message.channel.send(`I'm not letting you go higher than 99, ${utilitiesModule.getRandomNameInsult()}`);
                return;
            }
            inflateAmount = args[0];
        }
    }

    //If the user supplied more than one parameter, return
    else {
        message.channel.send(`Too many parameters, ${utilitiesModule.getRandomNameInsult()}`);
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
                        message.channel.send(`I don't want to fuck with anything around the size of 2mb, ${utilitiesModule.getRandomNameInsult()}`);
                        return;
                    }
                    else {
                        let msg = `alright hold on, inflating a ~${fileSize}mb image`;
                        if (appendSuggestion) msg += ` (for best results, keep inflation strength less than 2)`;
                        message.channel.send(msg);
        
                        gm(request(foundURL))
                            .implode(-inflateAmount)
                            .write('./graphics/resultImage.png', function (err) {
                                if (err) console.log(err);
                                if (inflateAmount == 69) message.channel.send({ files: ["./graphics/gotcha.png"] });
                                else message.channel.send({ files: ["./graphics/resultImage.png"] });
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