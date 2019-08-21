const dbUtils = require(`../../database_stuff/index_image_database_handler`);
const genUtils = require("../../command_utilities/general_utilities");
const fs = require("fs");



module.exports.run = async (bot, message, args) => {

    //Check if the user is whitelisted as an admin
    try {
        if (!genUtils.verifyWhitelistCommandCall(message, "admin")) return;
    }
    catch (err) {
        console.error(err);
    }

    /*let rawData = fs.readFileSync('./data/data_backups/7-29-2019/general_data/index_image_data.json');
    let indexDataJson = JSON.parse(rawData);

    for (let indexEntry in indexDataJson) {
        let newEntry = {
            index_name: undefined,
            url: undefined,
            culprit: undefined,
            direct_calls: 0,
            accidental_calls: 0
        }

        newEntry.index_name = indexEntry;
        newEntry.url = indexDataJson[indexEntry].url;
        newEntry.culprit = (indexDataJson[indexEntry].culprit) ? indexDataJson[indexEntry].culprit : `Unknown :(`;
        newEntry.direct_calls = (indexDataJson[indexEntry].directCalls) ? indexDataJson[indexEntry].directCalls : 0;
        newEntry.accidental_calls = 0;

        console.log(newEntry);
        dbUtils.setImageIndex(message.guild, newEntry);
    }*/

}

module.exports.help = {
    name: "test",
    description: "Test a specific functionality",
    usage: "!test",
    example: "!test",
    funFacts: [
        `This is an admin command! You probably are not able to use it.`,
        `This command changes all the time. It's only used to test very specific functionalities that can't be tested in any other command.`,
        `Sometimes, I use this command as a pseudo-script to perform a specific task once. For example, I used test once to transfer all of the index data from \
        the old JSON database system to the new SQLite system.`
    ]
}