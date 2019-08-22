const dbUtils = require(`../../database_stuff/misc_database_handler`);
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

    /*let rawData = fs.readFileSync('./data/static_command_data/pride_flag_data.json');
    let prideJson = JSON.parse(rawData);

    for (let flag in prideJson) {
        let newEntry = {
            flag_name: flag,
            description: prideJson[flag].description,
            colors: prideJson[flag].colors,
            people_count: 0
        }

        dbUtils.setPrideData(newEntry);
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