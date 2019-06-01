module.exports.run = async (bot, message, args) => {
    //message.channel.send({ files: ["./graphics/testImage.png"] });
    message.channel.send({
        embed: {
            image: {
                url: "https://cdn.discordapp.com/attachments/527341248214990850/584246501937643520/testImage.png"
            }
        }
    });
}

module.exports.help = {
    name: "magik"
}