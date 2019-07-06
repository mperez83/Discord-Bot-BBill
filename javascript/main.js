//All required things
const Discord = require("discord.js");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const fs = require("fs");
const config = require("../data/general_data/config.json");

const cleverbillModule = require("./string_parsing/cleverbill");
const informalCommandsModule = require("./string_parsing/string_parse");
const messageEvents = require("./joke_modules/messageEvents");
const utilitiesModule = require("./utilities");



//Loading basic commands
fs.readdir("./javascript/commands/", (err, files) => {
    if (err) console.error(err);

    let jsFiles = files.filter(f => f.split(".").pop() === "js");   //Gets the name of every .js file in the commands folder
    if (jsFiles.length <= 0) {
        console.log("No commands to load!");
        return;
    }

    console.log(`Loading ${jsFiles.length} commands!`);

    jsFiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });

    console.log();
});

//Loading magik commands
fs.readdir("./javascript/magik_commands/", (err, files) => {
    if (err) console.error(err);

    let jsFiles = files.filter(f => f.split(".").pop() === "js");
    if (jsFiles.length <= 0) {
        console.log("No commands to load!");
        return;
    }

    console.log(`Loading ${jsFiles.length} magik commands!`);

    jsFiles.forEach((f, i) => {
        let props = require(`./magik_commands/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });

    console.log();
});

//Loading pokemon commands
fs.readdir("./javascript/pokemon_commands/", (err, files) => {
    if (err) console.error(err);

    let jsFiles = files.filter(f => f.split(".").pop() === "js");
    if (jsFiles.length <= 0) {
        console.log("No commands to load!");
        return;
    }

    console.log(`Loading ${jsFiles.length} pokemon commands!`);

    jsFiles.forEach((f, i) => {
        let props = require(`./pokemon_commands/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });

    console.log();
});

//Loading admin commands
fs.readdir("./javascript/admin_commands/", (err, files) => {
    if (err) console.error(err);

    let jsFiles = files.filter(f => f.split(".").pop() === "js");
    if (jsFiles.length <= 0) {
        console.log("No commands to load!");
        return;
    }

    console.log(`Loading ${jsFiles.length} admin commands!`);

    jsFiles.forEach((f, i) => {
        let props = require(`./admin_commands/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });

    console.log();
});

//Ensure that the bot only starts working after it is ready
bot.on("ready", () => {
    console.log("Logged in! Serving in " + bot.guilds.array().length + " servers");

    //Update bill's id in the config file if something is wrong
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



//Create an event listener for messages
bot.on("message", (message) => {

    //Don't even consider messages from bbill
    if (message.author.bot) return;

    //Check if bbill is in construction mode
    if (config.construction_mode == "true") {
        if (message.author.id != "205106238697111552") {
            if (message.content.startsWith(config.prefix))
                message.channel.send(`I'm currently in construction_mode, ${utilitiesModule.getRandomNameInsult(message.author)}`);
            return;
        }
    }

    //Events checking
    messageEvents.checkForRandomEvents(message);
    
    //String parsing
    informalCommandsModule.parseTextForBadEmotes(message);
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

bot.login(config.token)
    .then(/*console.log*/)
    .catch(console.error);