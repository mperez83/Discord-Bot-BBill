//All required things
const Discord = require("discord.js");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const fs = require("fs");
const config = require("../data/general_data/config.json");

const cleverbillModule = require("./string_parsing/cleverbill");
const informalCommandsModule = require("./string_parsing/string_parse");
const messageEvents = require("./string_parsing/message_events");
const genUtils = require("./command_utilities/general_utilities");



//Load all commands
fs.readdir("./javascript/commands/", (err, cmdDirs) => {
    if (err) console.error(err);
    
    console.log();

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
                console.log(consoleMsg);
            });

            console.log();

        });

    }

});



//Ensure that the bot only starts working after it is ready
bot.on("ready", () => {
    console.log("Logged in! Serving in " + bot.guilds.array().length + " servers");

    //Update bill's id in the config file if his current id doesn't match the one in his config file
    if (!config.id) {
        console.log("Bot ID doesn't exist in config file, adding it now");
        config.id = bot.user.id;
        fs.writeFile("./data/general_data/config.json", JSON.stringify(config, null, 4), (err) => {if (err) console.error(err);});
    }
    else if (config.id != bot.user.id) {
        console.log("Bot ID doesn't match one listed in config file, updating it now");
        config.id = bot.user.id;
        fs.writeFile("./data/general_data/config.json", JSON.stringify(config, null, 4), (err) => {if (err) console.error(err);});
    }
});



//Create event listener for messages
bot.on("message", (message) => {

    //Don't even consider messages from bbill
    if (message.author.bot) return;

    //Check if bbill is in construction mode
    if (config.construction_mode == "true") {
        if (message.author.id != "205106238697111552") {
            
            if (message.content.startsWith(config.prefix)) {
                message.channel.send(`I'm currently in construction_mode, ${genUtils.getRandomNameInsult(message)}`);
            }

            //Do a return here outside of the for loop so big bill doesn't process any string events while in construction mode
            return;

        }
    }

    //Events checking
    messageEvents.handleEvents(message);
    
    //String parsing
    if (informalCommandsModule.parseTextForBadEmotes(message)) return;
    if (informalCommandsModule.parseTextForAtEveryone(message)) return;
    if (informalCommandsModule.parseTextForSpecificString(message)) return;
    if (informalCommandsModule.parseTextForLooseString(message)) return;
    if (cleverbillModule.parseTextForQuestions(message, bot)) return;



    //Command call parsing
    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);   //Slice out the command, leaving only the args

    if (!command.startsWith(config.prefix)) return;
    command = command.slice(config.prefix.length);  //Slice off command prefix
    command = command.toLowerCase();

    //Special command checks
    if (command.match(/^do+ge$/)) command = "doge";

    if (command == "ungulate") {
        command = "rimage";
        args = ["lil wayne"];
    }

    //If the command is invalid, change it to garfield
    if (!bot.commands.get(command)) command = "garfield";

    let cmd = bot.commands.get(command);
    if (cmd) {
        cmd.run(bot, message, args);
    }

});



//Create event listener for reactions
bot.on("messageReactionAdd", (messageReaction, user) => {
    if (messageReaction.me) return;

    if (messageReaction.emoji.name == `❗` || messageReaction.emoji.name == `✅`) {
        messageReaction.message.react(`🙃`);
    }
});



//Create event for when users update their info (such as their username)
bot.on("userUpdate", (oldUser, newUser) => {
    console.log(`${oldUser.username} updated their info`);
    console.log(oldUser);
    console.log(newUser);
});



//Create event for when users within a guild update their info (such as their nickname)
bot.on("guildMemberUpdate", (oldMember, newMember) => {
    if (oldMember.nickname != newMember.nickname) {
        if (newMember.nickname == "Big Bill") {
            //???
        }
    }
});



//Create event for when bbill hits the rateLimit
bot.on("rateLimit", (rateLimitInfo) => {
    //console.log(rateLimitInfo);
    //I feel like I should do something here but I'm not sure what
});



//Log bbill in
bot.login(config.token)
    .then(/*console.log*/)
    .catch(console.error);