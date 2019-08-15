const request = require("request");
const genUtils = require("../../command_utilities/general_utilities");



module.exports.run = async (bot, message, args) => {

    request("http://numbersapi.com/random/trivia?json", (err, res, body) => {
        let data = JSON.parse(body);
        if (data && data.text) {
            message.channel.send(`${data.text} ${genUtils.getRandomNameInsult(message)}`);
        }
    });

}

module.exports.help = {
    name: "numberfact",
    description: "Deploys an interesting fact about a random number",
    usage: "!numberfact",
    example: "!numberfact",
    funFacts: [
        "Out of all four number-fact generators, this one is the only one that didn't exist in the sample bot I referenced to create this command."
    ]
}