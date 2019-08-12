const Discord = require("discord.js");
const genUtils = require("../../command_utilities/general_utilities");



module.exports.run = async (bot, message, args) => {

    if (args.length == 0) {
        message.channel.send(`You have to provide a password, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }
    else if (args.length > 1) {
        message.channel.send(`Too many parameters, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }

    let password = args[0];
    if (!password.match(/^\d+$/g)) {
        message.channel.send(`The supplied password must be an integer, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }



    switch (password) {

        case "25":
        {
            let newEmbed = new Discord.RichEmbed();
            newEmbed.setImage(`https://cdn.discordapp.com/attachments/527666605396721684/610339595963334667/e4aa7c6e21b32fd6b97afd495fe4e338.png`);
            message.channel.send(newEmbed);
            break;
        }

        case "69":
        {
            message.channel.send(`🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆🍆`);
            break;
        }
        
        case "83":
        {
            let newEmbed = new Discord.RichEmbed();
            newEmbed.setImage(`https://cdn.discordapp.com/attachments/494016258078015491/610300158999265296/20190810_152708.jpg`);
            message.channel.send(newEmbed);
            break;
        }
        
        case "420":
        {
            let newEmbed = new Discord.RichEmbed();
            newEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/610330928807411715/testImage.png`);
            message.channel.send(newEmbed);
            break;
        }

        case "621":
        {
            let newEmbed = new Discord.RichEmbed();
            newEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/610341313224769550/gotcha.png`);
            message.channel.send(newEmbed);
            break;
        }
        
        case "666":
        {
            let newEmbed = new Discord.RichEmbed();
            newEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/584252304992108577/AaAAAaaaAAaAaaaaAaAAAAAaAaAa.jpg`);
            message.channel.send(newEmbed);
            break;
        }

        case "911":
        {
            message.channel.send(`https://youtu.be/AJW2LlphuSs?t=155`);
            break;
        }
        
        case "980":
        {
            message.channel.send(`honk honk`);
            break;
        }
        
        case "1273":
        {
            message.channel.send(`https://www.youtube.com/watch?v=jPrmR3RIoFE`);
            break;
        }
        
        case "1337":
        {
            message.channel.send(`😔`);
            break;
        }
        
        case "8008":
        case "80085":
        case "8008135":
        {
            bot.commands.get("fumika").run(bot, message, args);
            break;
        }

        case "12345":
        {
            message.channel.send("haha, nice one");
            break;
        }
        
        case "25565":
        {
            let newEmbed = new Discord.RichEmbed();
            newEmbed.setImage(`https://www.meme-arsenal.com/memes/4eef95644849536a6ab8e3f0c60eb18f.jpg`);
            message.channel.send(newEmbed);
            break;
        }

        case "27015":
        {
            let newEmbed = new Discord.RichEmbed();
            newEmbed.setImage(`https://cdn.discordapp.com/attachments/527341248214990850/610316597952774153/Steam_2019-08-11_20-39-57.png`);
            message.channel.send(newEmbed);
            break;
        }

        case "980089":
        {
            bot.commands.get("pride").run(bot, message, args);
            break;
        }
        
        case "2204355":
        {
            let newEmbed = new Discord.RichEmbed();
            newEmbed.setImage(`https://thumbs.gfycat.com/ConcernedFrayedAuklet-size_restricted.gif`);
            message.channel.send(newEmbed);
            break;
        }
        
        case "8675309":
        {
            message.channel.send("Jenny?");
            break;
        }

        case "01251999":
        {
            message.channel.send("https://itsyourbirthday.today/#bianca");
            break;
        }

        case "08011998":
        {
            message.channel.send("https://itsyourbirthday.today/#vincent");
            break;
        }

        case "10151996":
        {
            message.channel.send("https://itsyourbirthday.today/#kordell");
            break;
        }

        case "10261994":
        {
            message.channel.send("https://itsyourbirthday.today/#michael");
            break;
        }
        
        case "8005882300":
        {
            bot.commands.get("rimage").run(bot, message, ["empire today"]);
            break;
        }
        
        case "18775277454":
        {
            message.channel.send(`https://www.youtube.com/watch?v=ybJ6fS7ruuo`);
            break;
        }

        default:
        {
            message.channel.send(`Incorrect password. However, here's some info I found about that number:\n...`);
            bot.commands.get("urban").run(bot, message, args);
            break;
        }

    }

}

module.exports.help = {
    name: "password",
    description: "Takes a password, and produces an output if the password is correct",
    usage: "!password (number)",
    example: "!password 83",
    funFacts: [
        "This command spawned when I realized how many numbers associated with inside jokes there are, with some being more obscure than others. One obscure \
        one is listed in the example above."
    ]
}