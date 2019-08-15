const Discord = require("discord.js");
const genUtils = require('../command_utilities/general_utilities');

//const SQLite = require("better-sqlite3");
//const sql = new SQLite('./scores.sqlite');

let map_area = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let superCollectors = new Discord.Collection();

function movementFilter (reaction, user) {
    return user.id != "315755145365553155" && (reaction.emoji.name === '⬆' || reaction.emoji.name === '⬇' || reaction.emoji.name === '⬅' || reaction.emoji.name ==='➡');
};



function moveUp(billsAdventureChannel) {
    console.log("UP!!");
    drawUpdate(billsAdventureChannel);
}

function moveDown(billsAdventureChannel) {
    console.log("DOWN!!");
    drawUpdate(billsAdventureChannel);
}

function moveLeft(billsAdventureChannel) {
    console.log("LEFT!!");
    drawUpdate(billsAdventureChannel);
}

function moveRight(billsAdventureChannel) {
    console.log("RIGHT!!");
    drawUpdate(billsAdventureChannel);
}



function drawUpdate(billsAdventureChannel) {
    console.log("REDRAWN!!");
}

function drawInit(billsAdventureChannel) {

    let msg = ``;

    for (let row = 0; row < map_area.length; row++) {
        for (let col = 0; col < map_area[row].length; col++) {

            switch (map_area[row][col]) {

                case 0:
                    msg += `🌲`;
                    break;

                case 1:
                    msg += `<:aceBill:610264175721054208>`;
                    break;

            }

        }
        msg += `\n`;
    }

    billsAdventureChannel.send(msg)
        .then((newMsg) => {
            newMsg.react(`⬆`)
                .then(() => newMsg.react(`⬇`))
                .then(() => newMsg.react(`⬅`))
                .then(() => newMsg.react(`➡`))
                .then(() => {

                    if (!superCollectors.get(newMsg.guild.id)) {
                        let collector = newMsg.createReactionCollector(movementFilter, { time: 3600000 });

                        collector.on('collect', (reaction, reactionCollector) => {
                            switch (reaction.emoji.name) {
                                case `⬆`:
                                    moveUp(billsAdventureChannel);
                                    break;
                                case `⬇`:
                                    moveDown(billsAdventureChannel);
                                    break;
                                case `⬅`:
                                    moveLeft(billsAdventureChannel);
                                    break;
                                case `➡`:
                                    moveRight(billsAdventureChannel);
                                    break;
                            }
                        });

                        console.log(`New adventure collector created for ${newMsg.guild.name}`);

                        superCollectors.set(newMsg.guild.id, collector);
                    }
                    else {
                        console.log(`Adventuer collector already exists in ${newMsg.guild.name}! ${superCollectors.get(newMsg.guild.id)}`);
                    }

                })
                .catch(console.error);
        })
        .catch(console.error);

}
module.exports.drawInit = drawInit;