const fs = require("fs");
const utilitiesModule = require('../utilities');

module.exports.run = async (bot, message, args) => {
    utilitiesModule.readJSONFile("./data/shibeData.json", function (shibeDataJson) {

        let shibes = [];
        fs.readdirSync("./shibes/").forEach(file => {
            shibes.push(file);
        });

        let randomIndex = Math.floor(Math.random() * shibes.length);

        if (!shibeDataJson[shibes[randomIndex]]) shibeDataJson[shibes[randomIndex]] = { amount: 0 };
        shibeDataJson[shibes[randomIndex]].amount++;
        fs.writeFile("./data/shibeData.json", JSON.stringify(shibeDataJson), function(err) {if (err) return err;});

        utilitiesModule.readJSONFile("./data/indexImageData.json", function (indexListJson) {
            if (!indexListJson.indexCap) indexListJson.indexCap = 10;
            else indexListJson.indexCap += 0.1;
            fs.writeFileSync("./data/indexImageData.json", JSON.stringify(indexListJson));
            utilitiesModule.checkAndUpdateIndexList(bot, indexListJson);
        });

        let stats = fs.statSync("./shibes/" + shibes[randomIndex]);
        let fileSize = (stats["size"] / 1000000.0).toFixed(2);

        let sizeString;
        if (fileSize < 0.4)
            sizeString = `size - **${fileSize}mb**`;
        else if (fileSize >= 0.4 && fileSize < 1)
            sizeString = `size - **${fileSize}mb** (kinda big, may take a moment)`;
        else if (fileSize >= 1 && fileSize < 4)
            sizeString = `size - **${fileSize}mb** (fairly big, will take a while)`;
        else if (fileSize >= 4 && fileSize <= 8)
            sizeString = `size - **${fileSize}mb** (obscenely big, give me a minute or two)`;
        else {
            message.channel.send(`That fuckin image is **${fileSize}mb** big, I physically cannot upload that`);
            return;
        }

        if (shibes[randomIndex] == "komugi shibe 1.jpg") {
            message.channel.send(`**Holy shit, you unboxed '${shibes[randomIndex]}'!! There was a 1/${shibes.length} chance of that happening!**\n${sizeString}`);
        }
        else {
            message.channel.send(`**${shibes[randomIndex]}** (Amount unboxed: **${shibeDataJson[shibes[randomIndex]].amount}**)\n${sizeString}`);
        }

        console.log("Trying to send message...");
        message.channel.send({ files: ["./shibes/" + shibes[randomIndex] ]});
        console.log("Message sent!");

        utilitiesModule.incrementUserDataValue(message, "shibeCalls");

    });
}

module.exports.help = {
    name: "shibe"
}