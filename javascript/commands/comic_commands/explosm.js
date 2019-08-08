const Discord = require("discord.js");
const request = require("request");
const htmlparser = require("htmlparser2");

const genUtils = require('../../command_utilities/general_utilities');



module.exports.run = async (bot, message, args) => {

    let comicNum;
    
    if (args.length == 0) {
        //Nothing??
    }
    else if (args.length == 1) {
        comicNum = genUtils.verifyIntVal(args[0], 1, 5000, "Comic Number", message);
        if (!comicNum) return;
    }
    else {
        message.channel.send(`Too many parameters, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }


    
    let link;
    if (!comicNum) link = `http://explosm.net/comics/random`;
    else link = `http://explosm.net/comics/${comicNum}`;

    request(link, (err, res, body) => {

        if (err) console.error(err);

        let comicURL = res.request.uri.href;
        let imgURL;

        let parser = new htmlparser.Parser({
            onopentag: function(name, attribs) {
                if (name == "img" && attribs.id == "main-comic") {
                    imgURL = attribs.src;
                }
            }
        });
        parser.write(body);
        parser.end();

        if (!comicNum) {
            let splitURL = comicURL.split("/");
            comicNum = splitURL[splitURL.length - 2];
        }

        console.log(`#${comicNum}: ${imgURL}`);

        if (!imgURL || !imgURL.trim()) {
            message.channel.send(`No comic image found for comic number ${comicNum}, ${genUtils.getRandomNameInsult(message)}`);
        }
        else {
            let comicName = imgURL.match(/[\w-_]+\.(jpeg|jpg|gif|png)/)[0];

            let comicEmbed = new Discord.RichEmbed()
                .setTitle(`Explosm #${comicNum}`)
                .setURL(comicURL)
                .setDescription(`**__${comicName}__**`)
                .setImage(`http:${imgURL}`);
            
            message.channel.send(comicEmbed);
        }

    });

}

module.exports.help = {
    name: "explosm",
    description: "Attempts to post the specified explosm comic, or a random one if no number is provided",
    usage: "!explosm [number]",
    example: "!explosm 2399",
    funFacts: [
        "This is the second command to utilize the request package in a more indepth manner. Similar to scp, explosm parses through the page's HTML, and finds \
        the comic img within in order to post it.",
        "As opposed to scp, explosm has much better formatting in their page's HTML. Because they tag their comic's image as \"main-comic\", it was much \
        easier to extract it for discord."
    ]
}