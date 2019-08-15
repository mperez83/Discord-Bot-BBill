const genUtils = require("../../command_utilities/general_utilities");



module.exports.run = async (bot, message, args) => {

    if (args.length == 0) {
        message.channel.send(`Can't do an empty dice roll, ${genUtils.getRandomNameInsult(message)} (example usage: !roll 2d4)`);
        return;
    }
    else if (args.length > 1) {
        message.channel.send(`Too many parameters, ${genUtils.getRandomNameInsult(message)} (example usage: !roll 2d4)`);
        return;
    }



    let diceParams = args.join();

    if (!diceParams.match(/^\d+d\d+$/g)) {
        message.channel.send(`Incorrect parameter format, ${genUtils.getRandomNameInsult(message)} (example usage: !roll 2d4)`);
        return;
    }

    diceParams = diceParams.split("d");

    let numberOfDice = genUtils.verifyIntVal(parseInt(diceParams[0]), 1, 20, "Number of Dice", message);
    if (!numberOfDice) return;

    let typeOfDice = genUtils.verifyIntVal(parseInt(diceParams[1]), 2, 100, "Dice Type", message);
    if (!typeOfDice) return;

    if (numberOfDice == 6 && typeOfDice == 9) message.react(`🍆`);

    let finalMsg = ``;

    if (numberOfDice == 1) {
        finalMsg += `**${Math.ceil(Math.random() * typeOfDice)}**`;
    }
    else {
        let valueTotal = 0;
        for (let i = 0; i < numberOfDice; i++) {
            let curRoll = Math.ceil(Math.random() * typeOfDice);
            valueTotal += curRoll;

            if (i != (numberOfDice - 1))
                finalMsg += `${curRoll} + `;
            else
                finalMsg += `${curRoll} = `;
        }
        finalMsg += `**${valueTotal}**`;
    }

    message.channel.send(finalMsg);

}

module.exports.help = {
    name: "roll",
    description: "Rolls the specified amount of dice with the specified type of die",
    usage: "!roll (number of dice)d(number of sides on each die)",
    example: "!roll 2d4",
    funFacts: [
        "It surprises me how long it took me to implement these. This command seems like it would have been one of the first ideas I'd have had.",
        "I briefly considered allowing users to roll a die of up to the maximum possible javascript integer value, 9007199254740991, \
        but decided against it."
    ]
}