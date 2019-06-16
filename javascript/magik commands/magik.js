const fs = require("fs");
const gm = require("gm");
const imageMagick = require('gm').subClass({imageMagick: true});
const request = require("request");
const remote = require("remote-file-size");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {

    let magikAmount = 1;

    //If the user didn't supply a strength level, keep the magik level normal
    if (args.length == 0) {
        //keep magikAmount at default value
    }

    //If the user supplied a strength level for the magik, do tons of bullshit checking
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
            magikAmount = args[0];
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
                    let msg = `alright hold on, doing work on a ~${fileSize}mb image`;
                    message.channel.send(msg);
    
                    //Directly write method (not asynchronous??)
                    gm(request(validURL))
                        .filter("Gaussian")
                        .minify()
                        .minify()
                        .minify()
                        .magnify()
                        .magnify()
                        .magnify()
                        .write('./graphics/resultImage.png', function (err) {
                            if (err) console.log(err);
                            message.channel.send({ files: ["./graphics/resultImage.png"]});
                        });
                    
                    /*imageMagick(request(validURL))
                        .command("convert")
                        .in("./graphics/resultImage.png")
                        .in("-liquid-rescale", "50x100%\!")
                        .out("./graphics/resultImage.png")
                        .write('./graphics/resultImage.png', function (err) {
                            if (err) console.log(err);
                            //message.channel.send({ files: ["./graphics/resultImage.png"]});
                        });*/
    
                    /*imageMagick(request(validURL))
                        .resize(240, 240)
                        .write('./graphics/resultImage.png', function (err) {
                            if (err) console.log(err);
                            //message.channel.send({ files: ["./graphics/resultImage.png"]});
                        });*/
                }
            });
        }
        
    });

}

module.exports.help = {
    name: "magik"
}

/*let filename = Date.now();
    let pos = 62;
    let bodywidth = 15;
    let command;
    
    command = message.content.split(/\s/)[0];
    
    let a = command.split("a").length-2;
    if (a > 20) { a = 20; }
    let catlength = pos+a*bodywidth;
    
    let catimg = gm()
        .in("-page", "+0+0")
        .in("./static/cat/catbutt.png");
    
    for(pos; pos < catlength; pos += bodywidth) {
        catimg
            .in("-page", "+"+pos+"+0")
            .in("./static/cat/catbody.png");
    }
    
    catimg
        .in("-page", "+"+pos+"+0")
        .in("./static/cat/cathead.png")
        .background("transparent")
        .mosaic()
        .write("./static/cat/"+filename+".png", function(e){
            if(e) { console.log(e); }
            bot.sendFile(message.channel.id, "./static/cat/"+filename+".png", "cat.png", function(){
                if(e) { console.log(e); }
                fs.unlink("./static/cat/"+filename+".png", function(e){
                    if(e) { console.log(e); }
                });
            });
        });*/