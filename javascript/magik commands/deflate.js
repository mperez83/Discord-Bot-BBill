const gm = require("gm");
const request = require("request");
const remote = require("remote-file-size");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {

    let deflateAmount = 1;
    let appendSuggestion = false;

    //If the user didn't supply a strength level, keep the deflation level normal
    if (args.length == 0) {
        //keep deflateAmount at default value
    }

    //If the user supplied a strength level for the inflation, do tons of bullshit checking
    else if (args.length == 1) {
        if (isNaN(args[0])) {
            message.channel.send("That's not a fucking number, " + utilitiesModule.getRandomNameInsult());
            return;
        }
        else {
            if (args[0] < 0) {
                message.channel.send("Go use !inflate to do reverse deflates, " + utilitiesModule.getRandomNameInsult());
                return;
            }
            else if (args[0] == 0) {
                message.channel.send("???");
                return;
            }
            else if (args[0] > 1 && args[0] <= 99) {
                appendSuggestion = true;
                //message.channel.send("making a black hole huh");
            }
            else if (args[0] > 99) {
                message.channel.send("I'm not letting you go higher than 99, " + utilitiesModule.getRandomNameInsult());
                return;
            }
            deflateAmount = args[0];
        }
    }

    //If the user supplied more than one parameter, return
    else {
        message.channel.send("Too many parameters, " + utilitiesModule.getRandomNameInsult());
        return;
    }

    //Arbitrary divide by 2, to make the strength levels more sensible
    deflateAmount /= 2;

    utilitiesModule.getMostRecentImageURL(message).then(validURL => {

        if (!validURL) {
            message.channel.send("There weren't any things to deflate in the last 10 messages, " + utilitiesModule.getRandomNameInsult());
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
                    let msg = `alright hold on, deflating a ~${fileSize}mb image`;
                    if (appendSuggestion) msg += ` (for best results, keep deflation strength less than 1)`;
                    message.channel.send(msg);
    
                    gm(request(validURL))
                        .implode(deflateAmount)
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
    name: "deflate"
}