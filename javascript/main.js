//All required things
const Discord = require("discord.js");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const fs = require("fs");
const config = require("../data/general_data/config.json");

const cleverbillModule = require("./string_parsing/cleverbill");
const informalCommandsModule = require("./string_parsing/string_parse");
const messageEvents = require("./string_parsing/messageEvents");
const utilitiesModule = require("./utilities");



//Load all commands
fs.readdir("./javascript/commands/", (err, cmdDirs) => {
    if (err) console.error(err);
    
    console.log();

    //Do this here so we can get around any async bullshit
    utilitiesModule.readJSONFile("./data/general_data/commandData.json", function (cmdDataJson) {

        for (let i = 0; i < cmdDirs.length; i++) {
            fs.readdir(`./javascript/commands/${cmdDirs[i]}/`, (err, files) => {
                if (err) console.error(err);

                //Gets the name of every .js file from the directory we're in
                let jsFiles = files.filter(f => f.split(".").pop() === "js");
                if (jsFiles.length <= 0) {
                    console.log(`No commands to load in directory ${cmdDirs[i]}!\n`);
                    return;
                }

                console.log(`Loading ${jsFiles.length} commands from directory '${cmdDirs[i]}'!`);

                //Scrub through all of the jsFiles and add them to the bot.commands collection
                jsFiles.forEach((jsFile, index) => {
                    let props = require(`./commands/${cmdDirs[i]}/${jsFile}`);
                    bot.commands.set(props.help.name, props);
                    let consoleMsg = `${index + 1}: ${jsFile} loaded!`;

                    //Check if the command is in commandData.json
                    let cmdName = jsFile.slice(0, -3);
                    if (!cmdDataJson[cmdName]) {
                        consoleMsg += ` (no entry found in commandData.json, adding now)`;
                        cmdDataJson[cmdName] = { calls: 0 };
                        fs.writeFileSync("./data/general_data/commandData.json", JSON.stringify(cmdDataJson, null, 4), function(err) { if (err) return err; });
                    }

                    console.log(consoleMsg);
                });

                console.log();
            });
        }

    });
});



//Ensure that the bot only starts working after it is ready
bot.on("ready", () => {
    console.log("Logged in! Serving in " + bot.guilds.array().length + " servers");

    //Update bill's id in the config file if his current id doesn't match the one in his config file
    if (!config.id) {
        console.log("Bot ID doesn't exist in config file, adding it now");
        config.id = bot.user.id;
        fs.writeFileSync("./data/general_data/config.json", JSON.stringify(config, null, 4), function(err) {if (err) return err;});
    }
    else if (config.id != bot.user.id) {
        console.log("Bot ID doesn't match one listed in config file, updating it now");
        config.id = bot.user.id;
        fs.writeFileSync("./data/general_data/config.json", JSON.stringify(config, null, 4), function(err) {if (err) return err;});
    }
});



//Create event listener for messages
bot.on("message", (message) => {

    //Don't even consider messages from bbill
    if (message.author.bot) return;

    //Check if bbill is in construction mode
    if (config.construction_mode == "true") {
        if (message.author.id != "205106238697111552") {
            if (message.content.startsWith(config.prefix))
                message.channel.send(`I'm currently in construction_mode, ${utilitiesModule.getRandomNameInsult(message)}`);
            return;
        }
    }

    //Events checking
    messageEvents.handleEvents(message);
    
    //String parsing
    if (informalCommandsModule.parseTextForBadEmotes(message)) return;
    if (informalCommandsModule.parseTextForAtEveryone(message)) return;
    if (informalCommandsModule.parseTextForSpecificString(message)) return;
    if (informalCommandsModule.parseTextForLooseString(message, bot)) return;
    if (cleverbillModule.parseTextForQuestions(bot, message)) return;



    //Command call parsing
    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);   //Slice out the command, leaving only the args

    if (!command.startsWith(config.prefix)) return;
    command = command.slice(config.prefix.length);  //Slice off command prefix

    //Special command check (currently only !doge is a special command)
    if (command.match(/^do+ge$/)) command = "doge";

    //If the command is all caps, change it to garfield
    if (command == command.toUpperCase()) command = "garfield";

    let cmd = bot.commands.get(command);
    if (cmd) {
        //Increment command call count
        utilitiesModule.readJSONFile("./data/general_data/commandData.json", function (commandDataJson) {
            if (!commandDataJson[command]) commandDataJson[command] = { calls: 0 };
            commandDataJson[command].calls++;
            fs.writeFileSync("./data/general_data/commandData.json", JSON.stringify(commandDataJson, null, 4), function(err) {if (err) return err;});
        });
        cmd.run(bot, message, args);
    }

});



//Create event listener for reactions
bot.on("messageReactionAdd", (messageReaction, user) => {
    if (messageReaction.me) return;

    if (messageReaction.emoji.name == "❗") {
        utilitiesModule.incrementUserDataValue(user, "imposterScore", 1);
    }
});



//Create event for when users update their info (such as their username)
bot.on("userUpdate", (oldUser, newUser) => {
    console.log("SOMEONE updated their STATS");
    if (newUser.username != utilitiesModule.getUserDataValue(newUser, "username")) {
        console.log("the user updated their username, updating their userData now");
        utilitiesModule.updateUserDataValue(newUser, "username", newUser.username);
    }
});



//Create event for when users within a guild update their info (such as their nickname)
bot.on("guildMemberUpdate", (oldMember, newMember) => {
    if (oldMember.nickname != newMember.nickname) {
        if (newMember.nickname == "Big Bill") {
            utilitiesModule.incrementUserDataValue(newMember.user, "imposterScore", 1);
        }
    }
});



//Log bbill in
bot.login(config.token)
    .then(/*console.log*/)
    .catch(console.error);