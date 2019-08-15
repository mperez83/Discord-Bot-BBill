const request = require("request");
const genUtils = require("../../command_utilities/general_utilities");



module.exports.run = async (bot, message, args) => {

    request("http://numbersapi.com/random/date?json", (err, res, body) => {
        let data = JSON.parse(body);
        if (data && data.text) {
            message.channel.send(`${data.text} ${genUtils.getRandomNameInsult(message)}`);
        }
    });

}

module.exports.help = {
    name: "datefact",
    description: "Deploys an interesting fact about a random date",
    usage: "!datefact",
    example: "!datefact",
    funFacts: [
        "This command is one of four number-fact commands. They were all incredibly easy to implement, taking less than five minutes each."
    ]
}