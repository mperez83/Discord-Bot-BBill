const genUtils = require('../../command_utilities/general_utilities');
const wildMagicJSON = require(`./wildmagic_outcomes.json`);

module.exports.run = async (bot, message, args) => {
    let outcome = wildMagicJSON.outcomes[Math.floor(Math.random() * wildMagicJSON.outcomes.length)];
    message.channel.send(`${outcome}`);
}

module.exports.help = {
    name: "wildmagic",
    description: "Provides a random Wild Magic Surge outcome from a large list of potential outcomes",
    usage: "!wildmagic",
    example: "!wildmagic",
    funFacts: [
        `Vanilla DnD has a list of 50 surge outcomes, which are mostly pretty boring. Lots of homebrew outcomes have been made, and I
        wanted there to be a way to pull from all of them in the campaign I'm part of.`
    ]
}