const Discord = require("discord.js");



module.exports.run = async (bot, message, args) => {

    let newEmbed = new Discord.RichEmbed();
    newEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/584243982482145280/piplup.png`);
    message.channel.send(newEmbed);

}

module.exports.help = {
    name: "piplup",
    description: "Makes a piplup happen",
    usage: "!piplup",
    example: "!piplup",
    funFacts: [
        `This was one of the easiest commands to implement, because all it does is post a link to a picture of piplup`
    ]
}