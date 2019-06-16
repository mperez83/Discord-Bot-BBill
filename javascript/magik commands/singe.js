const gm = require("gm");
const request = require("request");
const remote = require("remote-file-size");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {

    let singeAmount = 1;

    //If the user didn't supply a strength level, keep the singe level normal
    if (args.length == 0) {
        //keep singeAmount at default value
    }

    //If the user supplied a strength level for the singe, do tons of bullshit checking
    else if (args.length == 1) {
        if (isNaN(args[0])) {
            message.channel.send("That's not a fucking number, " + utilitiesModule.getRandomNameInsult());
            return;
        }
        else {
            if (args[0] < -99) {
                message.channel.send("I'm not letting you go lower than -99, " + utilitiesModule.getRandomNameInsult());
                return;
            }
            else if (args[0] > 99) {
                message.channel.send("I'm not letting you go higher than 99, " + utilitiesModule.getRandomNameInsult());
                return;
            }
            singeAmount = args[0];
        }
    }

    //If the user supplied more than one parameter, return
    else {
        message.channel.send("Too many parameters, " + utilitiesModule.getRandomNameInsult());
        return;
    }

    utilitiesModule.getMostRecentImageURL(message).then(validURL => {

        if (!validURL) {
            return;
        }
        else {
            remote(validURL, function(err, size) {
                let fileSize = (size / 1000000.0).toFixed(2);
    
                if (fileSize > 2) {
                    message.channel.send(`I don't want to fuck with anything around the size of 2mb, ${utilitiesModule.getRandomNameInsult()}`);
                    return;
                }
                else {
                    let msg = `alright hold on, singing a ~${fileSize}mb image`;
                    message.channel.send(msg);
    
                    gm(request(validURL))
                        .charcoal(singeAmount)
                        .write('./graphics/resultImage.png', function (err) {
                            if (err) console.log(err);
                            message.channel.send({ files: ["./graphics/resultImage.png"]});
                        });
                }
            });
        }
        
    });

}

module.exports.help = {
    name: "singe"
}