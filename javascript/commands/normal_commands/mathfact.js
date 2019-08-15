const request = require("request");
const genUtils = require("../../command_utilities/general_utilities");



module.exports.run = async (bot, message, args) => {

    request("http://numbersapi.com/random/math?json", (err, res, body) => {
        let data = JSON.parse(body);
        if (data && data.text) {
            message.channel.send(`${data.text} ${genUtils.getRandomNameInsult(message)}`);
        }
    });

}

module.exports.help = {
    name: "mathfact",
    description: "Deploys an interesting random math fact",
    usage: "!mathfact",
    example: "!mathfact",
    funFacts: [
        "The website the info is requesting from makes it very easy to scrape tidbits like this."
    ]
}