const Discord = require("discord.js");
const request = require("request");
const htmlparser = require("htmlparser2");
const htmlentities = require("html-entities").AllHtmlEntities;

const genUtils = require('../../command_utilities/general_utilities');



module.exports.run = async (bot, message, args) => {

    try {
        if (!genUtils.verifyWhitelistCommandCall(message, "homestuck")) return;
    }
    catch (err) {
        console.error(err);
    }



    let pageNum;
    
    if (args.length == 0) {
        pageNum = Math.ceil(Math.random() * 8130);
    }
    else if (args.length == 1) {
        pageNum = genUtils.verifyIntVal(args[0], 1, 8130, "Page Number", message);
        if (!pageNum) return;
    }
    else {
        message.channel.send(`Too many parameters, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    request(`https://www.homestuck.com/story/${pageNum}`, (err, res, body) => {

        if (err) console.error(err);

        let imgURL;

        let parser = new htmlparser.Parser({
            onopentag: function(name, attribs) {
                if (name == "img" && attribs.src.match(/(https:\/\/www.homestuck.com\/images\/storyfiles\/hs2\/).*\.(jpeg|jpg|gif|png).*/)) {
                    imgURL = attribs.src;
                }
            }
        });
        parser.write(body);
        parser.end();

        if (!imgURL || !imgURL.trim()) {
            message.channel.send(`Page ${pageNum} does not contain an image, ${genUtils.getRandomNameInsult(message)}`);
        }
        else {
            let comicEmbed = new Discord.RichEmbed()
                .setTitle(`Page #${pageNum}`)
                .setURL(`https://www.homestuck.com/story/${pageNum}`)
                .setImage(`${imgURL}`);
            message.channel.send(comicEmbed);
        }

    });

}

module.exports.help = {
    name: "homestuck",
    description: "Attempts to post the specified homestuck page, or a random one if no number is provided",
    usage: "!homestuck",
    example: "!homestuck",
    funFacts: [
        `The picosecond I realized how easy it was to parse webcomic pages for the comic's image, I knew what I had to do.`,
        `If a homestuck page doesn't display, it's probably because they contain a Flash application, video, or some other non-image media.`,
        `This command has the potential to post homestuck spoilers, so it's been whitelisted to only a couple servers/users.`
    ]
}