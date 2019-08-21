const Discord = require("discord.js");
const request = require("request");
const htmlparser = require("htmlparser2");
const htmlentities = require("html-entities").AllHtmlEntities;

const genUtils = require('../../command_utilities/general_utilities');

const entities = new htmlentities();



module.exports.run = async (bot, message, args) => {

    request(`http://nedroid.com/?randomcomic=1`, (err, res, body) => {

        if (err) console.error(err);

        let comicURL = res.request.uri.href;
        let imgURL;
        let altText;
        let hoverText;

        let parser = new htmlparser.Parser({
            onopentag: function(name, attribs) {
                if (name == "img" && attribs.src.match(/(http:\/\/nedroid.com\/comics\/).*\.(jpeg|jpg|gif|png).*/)) {
                    imgURL = attribs.src;
                    if (attribs.alt) altText = attribs.alt;
                    if (attribs.title) hoverText = attribs.title;
                }
            }
        });
        parser.write(body);
        parser.end();

        if (!imgURL || !imgURL.trim()) {
            console.log(comicURL);
            message.channel.send(`No comic found??? (this message should never appear) ${genUtils.getRandomNameInsult(message)}`);
        }
        else {
            if (!altText || !altText.trim()) altText = "???";
            if (!hoverText || !hoverText.trim()) hoverText = "???";

            let comicEmbed = new Discord.RichEmbed()
                .setTitle(`${entities.decode(altText)}`)
                .setURL(comicURL)
                .setDescription(`${entities.decode(hoverText)}`)
                .setImage(`${imgURL}`)
                .setColor(`#789dca`);

            message.channel.send(comicEmbed);
        }

    });

}

module.exports.help = {
    name: "nedroid",
    description: "Attempts to post a random nedroid comic",
    usage: "!nedroid",
    example: "!nedroid",
    funFacts: [
        `This command is my first attempt at utilizing a webcomic's inbuilt "random comic" functionality. It worked way easier than I thought it would, and \
        tremendously helped my understanding of HTML parsing.`,
        `Nedroid has an excellent format for their comic titles and hover texts, which makes it very easy to parse and utilize in the discord embed messages.`,
        `The title of a given nedroid comic can only properly be seen through HTML parsing. The comic's title can be seen in the URL of the page, but \
        the properly formatted version of the title can only be seen in the alt text of the comic's image.`
    ]
}