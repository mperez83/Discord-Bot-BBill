const fs = require("fs");
const gm = require("gm");
const request = require("request");
const rp = require("request-promise");
const utilitiesModule = require('../../utilities');
const config = require("../../../data/general_data/config.json");



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${utilitiesModule.getRandomNameInsult(message.author)}`);
        return;
    }

    let deflateAmount = 1;
    let appendSuggestion = false;

    //If the user didn't supply a strength level, keep the deflation level normal
    if (args.length == 0) {
        //keep deflateAmount at default value
    }

    //If the user supplied a strength level for the deflation, do tons of bullshit checking
    else if (args.length == 1) {
        if (isNaN(args[0])) {
            message.channel.send(`That's not a fucking number, ${utilitiesModule.getRandomNameInsult(message.author)}`);
            return;
        }
        else {
            if (args[0] < 0) {
                message.channel.send(`Go use !inflate to do reverse deflates, ${utilitiesModule.getRandomNameInsult(message.author)}`);
                return;
            }
            else if (args[0] == 0) {
                message.channel.send(`???`);
                return;
            }
            else if (args[0] > 1 && args[0] <= 99) {
                appendSuggestion = true;
                //message.channel.send(`making a black hole huh`);
            }
            else if (args[0] > 99) {
                message.channel.send(`I'm not letting you go higher than 99, ${utilitiesModule.getRandomNameInsult(message.author)}`);
                return;
            }
            deflateAmount = args[0];
        }
    }

    //If the user supplied more than one parameter, return
    else {
        message.channel.send(`Too many parameters, ${utilitiesModule.getRandomNameInsult(message.author)}`);
        return;
    }

    //Arbitrary divide by 2, to make the strength levels more sensible
    deflateAmount /= 2;

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
                        let msg = `alright hold on, deflating a ~${fileSize}mb image`;
                        if (appendSuggestion) msg += ` (for best results, keep deflation strength less than 1)`;
                        message.channel.send(msg);

                        let filename = Date.now();
        
                        gm(request(foundURL))
                            .implode(deflateAmount)
                            .write(`./graphics/${filename}.png`, function (err) {
                                if (err) console.error(err);
                                message.channel.send({ files: [`./graphics/${filename}.png`] })
                                    .then(function(msg) {
                                        fs.unlink(`./graphics/${filename}.png`, function(err) { if (err) throw err; });
                                    })
                                    .catch(console.error);
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
    name: "deflate"
}