const fs = require("fs");
const gm = require("gm");
const imageMagick = require('gm').subClass({imageMagick: true});
const request = require("request");
const rp = require("request-promise");
const utilitiesModule = require('../utilities');
const config = require("../../data/general_data/config.json");



module.exports.run = async (bot, message, args) => {

    if (config.lite_mode == "true") {
        message.channel.send(`Currently in lite_mode, can't use expensive commands. ${utilitiesModule.getRandomNameInsult()}`);
        return;
    }

    let magikAmount = 1;

    //If the user didn't supply a strength level, keep the magik level normal
    if (args.length == 0) {
        //keep magikAmount at default value
    }

    //If the user supplied a strength level for the magik, do tons of bullshit checking
    else if (args.length == 1) {
        if (isNaN(args[0])) {
            message.channel.send(`That's not a fucking number, ${utilitiesModule.getRandomNameInsult()}`);
            return;
        }
        else {
            if (args[0] < -99) {
                message.channel.send(`I'm not letting you go lower than -99, ${utilitiesModule.getRandomNameInsult()}`);
                return;
            }
            else if (args[0] > 99) {
                message.channel.send(`I'm not letting you go higher than 99, ${utilitiesModule.getRandomNameInsult()}`);
                return;
            }
            magikAmount = args[0];
        }
    }

    //If the user supplied more than one parameter, return
    else {
        message.channel.send(`Too many parameters, ${utilitiesModule.getRandomNameInsult()}`);
        return;
    }



    let foundURL;

    utilitiesModule.getMostRecentImageURL(message).then(requestedURL => {

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
                    let fileSize = (response.headers['content-length'] / 1000000.0).toFixed(2);
    
                    if (fileSize > 2) {
                        message.channel.send(`I don't want to fuck with anything around the size of 2mb, ${utilitiesModule.getRandomNameInsult()}`);
                        return;
                    }
                    else {
                        message.channel.send(`alright hold on, doing work on a ~${fileSize}mb image`);
        
                        //Directly write method (not asynchronous??)
                        gm(request(foundURL))
                            .filter("Gaussian")
                            .minify()
                            .minify()
                            .minify()
                            .magnify()
                            .magnify()
                            .magnify()
                            .write('./graphics/resultImage.png', function (err) {
                                if (err) console.log(err);
                                message.channel.send({ files: ["./graphics/resultImage.png"] });
                            });
                        
                        /*imageMagick(request(foundURL))
                            .command("convert")
                            .in("./graphics/resultImage.png")
                            .in("-liquid-rescale", "50x100%\!")
                            .out("./graphics/resultImage.png")
                            .write('./graphics/resultImage.png', function (err) {
                                if (err) console.log(err);
                                //message.channel.send({ files: ["./graphics/resultImage.png"] });
                            });*/
        
                        /*imageMagick(request(foundURL))
                            .resize(240, 240)
                            .write('./graphics/resultImage.png', function (err) {
                                if (err) console.log(err);
                                //message.channel.send({ files: ["./graphics/resultImage.png"] });
                            });*/
                    }
                })
                .catch(function (err) {
                    console.error(err);
                });
        }
        
    });

}

module.exports.help = {
    name: "magik"
}