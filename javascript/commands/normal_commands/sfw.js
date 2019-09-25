const Discord = require("discord.js");



module.exports.run = async (bot, message, args) => {

    /*for (let i = 0; i < 3; i++) {
        let newEmbed = new Discord.RichEmbed();
        newEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/584244981397454884/sfw_sasuke.jpg`);
        message.channel.send(newEmbed);
    }*/

    let msg = `<:vtwinkie1:595359362147680266>\n`;
    for (let i = 0; i < 30; i++) {
        msg += `<:vtwinkie2:595359360884932619>\n`;
    }
    msg += `<:vtwinkie3:595359361283653632>`;

    message.channel.send(msg);

}

module.exports.help = {
    name: "sfw",
    description: "Purges the chat of its sins",
    usage: "!sfw",
    example: "!sfw",
    funFacts: [
        `If I recall correctly, this was the first command ever created. The concept of posting an image three times in a row was an easy enough task to act \
        as my intro to Discord.js.`,
        `This command used to be three "sfw sasuke" images posted one after another. The new doge train is much more efficient, and tonally appropriate.`
    ]
}