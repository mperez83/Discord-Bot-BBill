const fs = require("fs");
const gm = require("gm");



function reduceImageFileSize(message, filename, chopNum, targetFileSize, callback) {
    gm(`./graphics/${filename}.png`)
        .minify()
        .write(`./graphics/${filename}.png`, function (err) {
            let stats = fs.statSync(`./graphics/${filename}.png`);
            let fileSize = (stats["size"] / 1000000.0).toFixed(2);

            if (fileSize > targetFileSize) {
                reduceImageFileSize(message, filename, chopNum+1, targetFileSize, callback);
            }
            else {
                message.channel.send(`Image chopped **${chopNum}** time${(chopNum > 1) ? 's' : ''}, actually applying magik now`);
                callback();
            }
        });
}
module.exports.reduceImageFileSize = reduceImageFileSize;