module.exports.run = async (bot, message, args) => {

    message.channel.send(`F`);

    /*genUtils.readJSONFile(dataLoc, (userDataJson) => {

        //If the user tried to supply some kind of argument, cut that shit right off
        if (args.length > 0) {
            message.channel.send(`do not tarnish your presige call with arguments, ${genUtils.getRandomNameInsult(message)}`);
            return;
        }

        

        if (!userDataJson[message.author.id]) userDataJson[message.author.id] = {username: message.author.username};

        if (!userDataJson[message.author.id].power) {
            userDataJson[message.author.id].power = 0;
            userDataJson[message.author.id].nextValidPowerCheck = undefined;
        }

        if (userDataJson[message.author.id].power != 69) {
            message.reply(`you are not eligible to prestige, ${genUtils.getRandomNameInsult(message)}`);
            return;
        }
        else {
            userDataJson[message.author.id].power = 0;
            fs.writeFile(dataLoc, JSON.stringify(userDataJson, null, 4), (err) => {
                if (err) console.error(err);
                genUtils.incrementUserDataValue(message.author, "prestigeLevel", 1, (newValue) => {
                    message.reply(`you are now ${newValue} better than everyone else`);
                });
                ahm.awardAchievement(message, ahm.achievement_list_enum.FIRST_PRESTIGE);
            });
            return;
        }

    });*/

}

module.exports.help = {
    name: "prestige"
}