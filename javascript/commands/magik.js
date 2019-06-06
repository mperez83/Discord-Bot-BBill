const fs = require("fs");
const gm = require("gm");
const imageMagick = require('gm').subClass({imageMagick: true});
const request = require("request");
const remote = require("remote-file-size");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {

    message.channel.fetchMessages({ limit: 10 })
    .then(messagesToCheck => {
        let validURL;

        for (let i = 0; i < messagesToCheck.size; i++) {

            let curMessage = messagesToCheck.array()[i];

            if (curMessage.attachments.size > 0) {
                let potentialImage = curMessage.attachments.last();

                //This is the only way I know of to check if an attachment is an image
                if (potentialImage.width != undefined && potentialImage.height != undefined) {
                    validURL = potentialImage.url;
                    break;
                }
            }

            if (curMessage.embeds.length > 0) {
                let potentialImage = curMessage.embeds[curMessage.embeds.length - 1];

                //This is the only way I know of to check if an embed contains an image
                if (potentialImage.image != null) {
                    validURL = potentialImage.image.url;
                    break;
                }
            }

        }

        if (!validURL) {
            message.channel.send("There weren't any images to terrorize in the last ten messages, " + utilitiesModule.getRandomNameInsult());
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
                    message.channel.send(`alright hold on, doing work on a ~${fileSize}mb image`);

                    //Directly write method (not asynchronous??)
                    gm(request(validURL))
                        .implode(-1.2)
                        .write('./graphics/resultImage.png', function (err) {
                            if (err) console.log(err);
                            message.channel.send(`posting rn`);
                            message.channel.send({ files: ["./graphics/resultImage.png"]});
                        });
                    
                    /*imageMagick(request(validURL))
                        .command("convert")
                        .in("./graphics/resultImage.png")
                        .in("-liquid-rescale", "50x100%\!")
                        .out("./graphics/resultImage.png")
                        .write('./graphics/resultImage.png', function (err) {
                            if (err) console.log(err);
                            message.channel.send(`posting rn`);
                            //message.channel.send({ files: ["./graphics/resultImage.png"]});
                        });*/

                    /*imageMagick(request(validURL))
                        .resize(240, 240)
                        .write('./graphics/resultImage.png', function (err) {
                            if (err) console.log(err);
                            message.channel.send(`posting rn`);
                            //message.channel.send({ files: ["./graphics/resultImage.png"]});
                        });*/
                }
            });
        }
    })
    .catch(console.error);
    
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
}

module.exports.help = {
    name: "magik"
}