const gm = require("gm");
const request = require("request");
const remote = require("remote-file-size");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {

    let inflateAmount = 1;
    let appendSuggestion = false;

    //If the user didn't supply a strength level, keep the inflation level normal
    if (args.length == 0) {
        //keep inflateAmount at default value
    }

    //If the user supplied a strength level for the inflation, do tons of bullshit checking
    else if (args.length == 1) {
        if (isNaN(args[0])) {
            message.channel.send("That's not a fucking number, " + utilitiesModule.getRandomNameInsult());
            return;
        }
        else {
            if (args[0] < 0) {
                message.channel.send("Go use !deflate to do reverse inflates, " + utilitiesModule.getRandomNameInsult());
                return;
            }
            else if (args[0] == 0) {
                message.channel.send("???");
                return;
            }
            else if (args[0] > 2 && args[0] <= 99) {
                appendSuggestion = true;
                //message.channel.send("kinky mf huh");
            }
            else if (args[0] > 99) {
                message.channel.send("I'm not letting you go higher than 99, " + utilitiesModule.getRandomNameInsult());
                return;
            }
            inflateAmount = args[0];
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
                    let msg = `alright hold on, inflating a ~${fileSize}mb image`;
                    if (appendSuggestion) msg += ` (for best results, keep inflation strength less than 2)`;
                    message.channel.send(msg);
    
                    gm(request(validURL))
                        .implode(-inflateAmount)
                        .write('./graphics/resultImage.png', function (err) {
                            if (err) console.log(err);
                            if (inflateAmount == 69) message.channel.send({ files: ["./graphics/gotcha.png"]});
                            else message.channel.send({ files: ["./graphics/resultImage.png"]});
                        });
                }
            });
        }
        
    });

}

module.exports.help = {
    name: "inflate"
}