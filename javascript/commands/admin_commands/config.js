const fs = require("fs");
const genUtils = require('../../command_utilities/general_utilities');
const config = require("../../../data/general_data/config.json");



module.exports.run = async (bot, message, args) => {

    //if this message wasn't sent by ME, return
    if (message.author.id != "205106238697111552") {
        message.channel.send(`unauthorized access, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }

    //Parameter count checks
    if (args.length == 0) {
        message.channel.send(`Not enough args, ${genUtils.getRandomNameInsult(message)} (!config requires 1 arg for a key query, or 2 args to set a key/value)`);
        return;
    }
    else if (args.length > 2) {
        message.channel.send(`Too many args, ${genUtils.getRandomNameInsult(message)} (!config requires 1 arg for a key query, or 2 args to set a key/value value)`);
        return;
    }

    //Return if we try to access a forbidden key
    if (args[0] == "token" || args[0] == "youtube_api_key" || args[0] == "google_custom_search" || args[0] == "id") {
        message.channel.send(`don't touch that`);
        return;
    }

    
    
    //Key query
    if (args.length == 1) {
        if (!config[args[0]]) {
            message.channel.send(`There is no key named "${args[0]}" in the config file, ${genUtils.getRandomNameInsult(message)}`);
            return;
        }
        else {
            message.channel.send(`${args[0]} = ${config[args[0]]}`);
            return;
        }
    }

    //Key/value set
    else {
        if (!config[args[0]]) {
            message.channel.send(`There is no key named "${args[0]}" in the config file, ${genUtils.getRandomNameInsult(message)}`);
            return;
        }
        else {

            //Check if it's a boolean
            if (config[args[0]] == "true" || config[args[0]] == "false") {
                if (args[1] == "true" || args[1] == "false") {
                    config[args[0]] = args[1];
                    message.channel.send(`Set config key "${args[0]}" to ${args[1]}`);
                    fs.writeFile("./data/general_data/config.json", JSON.stringify(config, null, 4), (err) => { if (err) console.error(err); });
                    
                    //Specific stuff for if the key was construction_mode
                    if (args[0] == "construction_mode") {
                        bot.user.setAvatar((args[1] == "true") ? `./graphics/misc/inactive_bill.png` : `./graphics/misc/active_bill.png`);
                    }
                }
                else {
                    message.channel.send(`Config key "${args[0]}" is a boolean, so you have to provide a boolean as the second arg. ${genUtils.getRandomNameInsult(message)}`);
                    return;
                }
            }

            //Check if it's a number
            else if (!isNaN(config[args[0]])) {
                if (isNaN(args[1])) {
                    message.channel.send(`Config key "${args[0]}" is a number, so you have to provide a number as the second arg. ${genUtils.getRandomNameInsult(message)}`);
                    return;
                }
                else {
                    config[args[0]] = args[1];
                    message.channel.send(`Set config key "${args[0]}" to ${args[1]}`);
                    fs.writeFile("./data/general_data/config.json", JSON.stringify(config, null, 4), (err) => { if (err) console.error(err); });
                }
            }

            //If neither of the above, it must be a string
            else {
                config[args[0]] = args[1];
                message.channel.send(`Set config key "${args[0]}" to ${args[1]}`);
                fs.writeFile("./data/general_data/config.json", JSON.stringify(config, null, 4), (err) => { if (err) console.error(err); });
            }

        }
    }

}

module.exports.help = {
    name: "config"
}