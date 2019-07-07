const request = require("request");

const utilitiesModule = require('../../utilities');
const config = require("../../../data/general_data/config.json");



module.exports.run = async (bot, message, args) => {
    args = args.join(" ");
    if (args.length == 0) {
        message.channel.send(`I can't search for nothing, ${utilitiesModule.getRandomNameInsult(message.author)}`);
        return;
    }

    let page = 1;
    request(`https://www.googleapis.com/customsearch/v1?key=${config.youtube_api_key}&cx=${config.google_custom_search}&q=${(args.replace(/\s/g, '+'))}&searchType=image&alt=json&num=10&start=${page}&fileType=gif`, function (err, res, body) {
        let data, error;
        try {
            data = JSON.parse(body);
        } catch (error) {
            console.log(error);
            return;
        }
        if (!data) {
            message.channel.send(`Error:\n${JSON.stringify(data, null, 4)}`);
            return;
        }
        else if (!data.items || data.items.length == 0) {
            message.channel.send(`No result for "${args}", ${utilitiesModule.getRandomNameInsult(message.author)}`);
            return;
        }
        let firstResult = data.items[0];
        message.channel.send(`${firstResult.title}\n${firstResult.link}`);
    });
}

module.exports.help = {
    name: "gif"
}