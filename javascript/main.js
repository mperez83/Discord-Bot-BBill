//All required things
const Discord = require("discord.js");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const fs = require("fs");
const config = require("../data/config.json");
const utilitiesModule = require('./utilities');
const cleverbillModule = require("./cleverbill");



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

//Loading pokemon commands
fs.readdir("./javascript/pokemon commands/", (err, files) => {
    if (err) console.error(err);

    let jsFiles = files.filter(f => f.split(".").pop() === "js");
    if (jsFiles.length <= 0) {
        console.log("No commands to load!");
        return;
    }

    console.log(`Loading ${jsFiles.length} pokemon commands!`);

    jsFiles.forEach((f, i) => {
        let props = require(`./pokemon commands/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });

    console.log();
});

//Ensure that the bot only starts working after it is ready
bot.on("ready", () => {
    console.log("Logged in! Serving in " + bot.guilds.array().length + " servers");
});



//Create an event listener for messages
bot.on("message", (message) => {

    if (message.author.bot) return;

    if (message.content.includes("<:GWfroggyFeelsUpMan:400751139563241473>")) {
        //message.channel.send("bad emote");
        utilitiesModule.incrementUserDataValue(message.author, "sin", 5);
        return;
    }

    //If someone uses the @here or @everyone command, get mad
    if (message.mentions.everyone) {
        message.channel.send(">:0");
        return;
    }

    //If it finds a question and answers it, return from the whole thing
    if (cleverbillModule.parseTextForQuestions(message)) {
        return;
    }

    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0];
    let args = messageArray.slice(1);   //Slice out the command, leaving only the args

    if (!command.startsWith(config.prefix)) return;
    command = command.slice(config.prefix.length);  //Slice off command prefix !

    let cmd = bot.commands.get(command);
    if (cmd) cmd.run(bot, message, args);

});

bot.login(config.token)
    .then(console.log)
    .catch(console.error);