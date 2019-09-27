const Discord = require("discord.js");
const genUtils = require('../javascript/command_utilities/general_utilities');

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

let serverAdventureInfo = new Discord.Collection();



function movementFilter (reaction, user) {
    return user.id != "315755145365553155" && (reaction.emoji.name === '⬆' || reaction.emoji.name === '⬇' || reaction.emoji.name === '⬅' || reaction.emoji.name ==='➡');
};



function moveUp() {
    console.log("UP!!");
    drawUpdate();
}

function moveDown() {
    console.log("DOWN!!");
    drawUpdate();
}

function moveLeft() {
    console.log("LEFT!!");
    drawUpdate();
}

function moveRight() {
    console.log("RIGHT!!");
    drawUpdate();
}



function drawUpdate() {
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

                    if (!serverAdventureInfo.has(newMsg.guild.id))
                        createMovementCollector(newMsg);
                    else
                        console.log(`Adventure collector already exists in ${newMsg.guild.name}! (this should never display) ${serverAdventureInfo.get(newMsg.guild.id)}`);

                })
                .catch(console.error);
        })
        .catch(console.error);

}
module.exports.drawInit = drawInit;

function wakeUp(message) {
    if (!serverAdventureInfo.has(message.guild.id)) {
        //createMovementCollector(message);
        message.channel.send(`The map is now active again.`);
    }
    else {
        message.channel.send(`The map is already active!`);
    }
}
module.exports.wakeUp = wakeUp;



function createMovementCollector(message) {
    let collector = message.createReactionCollector(movementFilter, { time: 3600000 });

    collector.on('collect', (reaction, reactionCollector) => {
        switch (reaction.emoji.name) {
            case `⬆`:
                moveUp();
                break;
            case `⬇`:
                moveDown();
                break;
            case `⬅`:
                moveLeft();
                break;
            case `➡`:
                moveRight();
                break;
        }
    });

    serverAdventureInfo.set(message.guild.id, collector);

    console.log(`Adventure movement collector created for ${message.guild.name}`);
}