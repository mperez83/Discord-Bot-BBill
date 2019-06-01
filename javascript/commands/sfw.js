module.exports.run = async (bot, message, args) => {
    //message.channel.send({ files: ["./graphics/sfw sasuke.jpg"] });
    //message.channel.send({ files: ["./graphics/sfw sasuke.jpg"] });
    //message.channel.send({ files: ["./graphics/sfw sasuke.jpg"] });

    message.channel.send({
        embed: {
            image: {
                url: "https://cdn.discordapp.com/attachments/527341248214990850/584244981397454884/sfw_sasuke.jpg"
            }
        }
    });

    message.channel.send({
        embed: {
            image: {
                url: "https://cdn.discordapp.com/attachments/527341248214990850/584244981397454884/sfw_sasuke.jpg"
            }
        }
    });

    message.channel.send({
        embed: {
            image: {
                url: "https://cdn.discordapp.com/attachments/527341248214990850/584244981397454884/sfw_sasuke.jpg"
            }
        }
    });
}

module.exports.help = {
    name: "sfw"
}