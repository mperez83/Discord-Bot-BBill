const gm = require("gm");
const request = require("request");
const rp = require("request-promise");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {

    //If the user tried to supply some kind of argument, cut that shit right off
    if (args.length > 0) {
        message.channel.send("Inkblot doesn't use parameters, " + utilitiesModule.getRandomNameInsult());
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
        
                    if (fileSize > 0.5) {
                        message.channel.send(`I don't want to inkify anything around the size of 0.5mb, ${utilitiesModule.getRandomNameInsult()}`);
                        return;
                    }
                    else {
                        gm(request(foundURL))
                            .size(function getSize(err, size) {
                                if (err) console.error(err);
                                else {
                                    let maxSingeAmount = (size.width < size.height) ? Math.floor(size.width / 2) - 1 : Math.floor(size.height / 2) - 1;
                                    let singeAmount = (maxSingeAmount < 99) ? maxSingeAmount : 99;

                                    message.channel.send(`alright hold on, blotting a ~${fileSize}mb image (takes a while, be patient)`);
                    
                                    gm(request(foundURL))
                                        .charcoal(1)
                                        .charcoal(1)
                                        .charcoal(1)
                                        .charcoal(1)
                                        .charcoal(singeAmount / 2)
                                        .charcoal(singeAmount)
                                        .charcoal(singeAmount)
                                        .charcoal(singeAmount)
                                        /*.filter("Gaussian")   //Cut all this shit out because it occurs before all the previous commands do
                                        .minify()               //which manipulates the width/height of the image presumably because of floating point
                                        .minify()               //error. This makes for a small chance that charcoal isn't able to properly run because
                                        .minify()               //the calculated singeAmount is no longer half the size of the width or height
                                        .magnify()
                                        .magnify()
                                        .magnify()*/
                                        .charcoal(singeAmount)
                                        .write('./graphics/resultImage.png', function (err) {
                                            if (err) console.log(err);
                                            message.channel.send({ files: ["./graphics/resultImage.png"]});
                                        });
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
    name: "inkblot"
}