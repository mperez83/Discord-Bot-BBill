module.exports.run = async (bot, message, args) => {
    //message.channel.send({ files: ["./graphics/pokemon stuff/sylveon.gif"] });
    message.channel.send({
        embed: {
            image: {
                url: "https://cdn.discordapp.com/attachments/527341248214990850/584243997049094145/sylveon.gif"
            }
        }
    });
}

module.exports.help = {
    name: "sylveon"
}