const Discord = require("discord.js");



module.exports.run = async (bot, message, args) => {

    for (let i = 0; i < 3; i++) {
        let newEmbed = new Discord.RichEmbed();
        newEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/584244981397454884/sfw_sasuke.jpg`);
        message.channel.send(newEmbed);
    }

}

module.exports.help = {
    name: "sfw"
}