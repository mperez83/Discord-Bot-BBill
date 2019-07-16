const fs = require("fs");
const gm = require("gm");
const request = require("request");



function writeAndShrinkImage(message, foundURL, filename, maxFileSize, callback) {
    writeImageToDisk(foundURL, filename, () => {

        let stats = fs.statSync(`./graphics/${filename}.png`);
        let fileSize = (stats["size"] / 1000000.0).toFixed(2);

        if (fileSize > maxFileSize) {
            reduceImageFileSize(message, filename, 1, maxFileSize, () => {
                callback();
            });
        }
        else {
            callback();
        }
        
    });
}
module.exports.writeAndShrinkImage = writeAndShrinkImage;



function reduceImageFileSize(message, filename, chopNum, targetFileSize, callback) {
    gm(`./graphics/${filename}.png`)
        .minify()
        .write(`./graphics/${filename}.png`, function (err) {
            if (err) console.error(err);

            let stats = fs.statSync(`./graphics/${filename}.png`);
            let fileSize = (stats["size"] / 1000000.0).toFixed(2);

            if (fileSize > targetFileSize) {
                reduceImageFileSize(message, filename, chopNum+1, targetFileSize, callback);
            }
            else {
                //message.channel.send(`Image chopped **${chopNum}** time${(chopNum > 1) ? 's' : ''}`);
                callback();
            }
        });
}
module.exports.reduceImageFileSize = reduceImageFileSize;



function writeImageToDisk(foundURL, filename, callback) {
    gm(request(foundURL))
        .write(`./graphics/${filename}.png`, (err) => {
            if (err) console.error(err);
            callback();
        });
}
module.exports.writeImageToDisk = writeImageToDisk;