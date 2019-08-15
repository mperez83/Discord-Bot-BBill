const request = require("request");
const genUtils = require("../../command_utilities/general_utilities");



module.exports.run = async (bot, message, args) => {

    request("http://numbersapi.com/random/year?json", (err, res, body) => {
        let data = JSON.parse(body);
        if (data && data.text) {
            message.channel.send(`${data.text} ${genUtils.getRandomNameInsult(message)}`);
        }
    });

}

module.exports.help = {
    name: "yearfact",
    description: "Deploys an interesting fact about a random year",
    usage: "!yearfact",
    example: "!yearfact",
    funFacts: [
        "This was one of the easiest commands to implement, along with the other three number-fact commands."
    ]
}