const getSize = require('get-folder-size');



module.exports.run = async (bot, message, args) => {

    message.channel.send(`Alright hold on, I'm getting on the scale`);
    
    getSize(`../Discord-Bot-BBill/`, (err, size) => {
        if (err) console.error(err);
        message.channel.send(`I weigh about **${(size / 1024 / 1024 / 1024).toFixed(2)} gb**`);
    });

}

module.exports.help = {
    name: "weight",
    description: "Posts how large Big Bill is in gigabytes",
    usage: "!weight",
    example: "!weight",
    funFacts: [
        `The fumika graphics folder accounts for approximately 70% of Big Bill's cumulative file size.`
    ]
}