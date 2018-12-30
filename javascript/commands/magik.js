module.exports.run = async (bot, message, args) => {
    message.channel.send({ files: ["./misc stuff/testImage.png"] });
}

module.exports.help = {
    name: "magik"
}