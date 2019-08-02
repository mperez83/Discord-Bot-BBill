const Discord = require("discord.js");
const request = require("request");
const htmlparser = require("htmlparser2");

const genUtils = require('../../command_utilities/general_utilities');



module.exports.run = async (bot, message, args) => {

    let scpNum;
    
    if (args.length == 0) {
        scpNum = Math.ceil(Math.random() * 4000);
    }
    else if (args.length == 1) {
        scpNum = genUtils.verifyIntVal(args[0], 1, 4000, "SCP Number", message);
        if (!scpNum) return;
    }
    else {
        message.channel.send(`Too many parameters, ${genUtils.getRandomNameInsult(message)}`);
        return;
    }


    //SCP URLs are either 3 figures or 4 figures long, depending on if they're less than 1000 or not
    if (scpNum < 1000) scpNum = (`000${scpNum}`).slice(-3);
    else scpNum = (`0000${scpNum}`).slice(-4);
    console.log(scpNum);

    request(`http://www.scp-wiki.net/scp-${scpNum}`, (err, res, body) => {

        if (err) console.error(err);



        let objectClass;
        let flagToGetObjectClass = false;
        let specialContainmentProcedures;
        let flagToGetSpecialContainmentProcedures = false;
        let description;
        let flagToGetDescription = false;

        let scpImageURL;
        let flagToGetScpImageURL;

        let parser = new htmlparser.Parser({

            ontext: function(text){

                //Object Class
                if (flagToGetObjectClass) {
                    objectClass = text;
                    flagToGetObjectClass = false;
                }

                if (text == "Object Class:") {
                    if (!objectClass) flagToGetObjectClass = true;
                }

                //Containment Procedure
                if (flagToGetSpecialContainmentProcedures) {
                    specialContainmentProcedures = text;
                    flagToGetSpecialContainmentProcedures = false;
                }

                if (text == "Special Containment Procedures:") {
                    if (!specialContainmentProcedures) flagToGetSpecialContainmentProcedures = true;
                }

                //Description
                if (flagToGetDescription) {
                    description = text;
                    flagToGetDescription = false;
                }

                if (text == "Description:") {
                    if (!description) flagToGetDescription = true;
                }

            },

            onopentag: function(name, attribs) {

                if (name == "div") {
                    if (attribs.class && attribs.class == "scp-image-block block-right") {
                        flagToGetScpImageURL = true;
                    }
                }

                if (name == "img" && flagToGetScpImageURL) {
                    scpImageURL = attribs.src;
                    flagToGetScpImageURL = false;
                }

            }

        });
        parser.write(body);
        parser.end();



        if (!objectClass) objectClass = `???`;
        else {
            objectClass = objectClass.trim();
            objectClass = genUtils.shrinkString(objectClass, 1024, true);
        }

        if (!specialContainmentProcedures) specialContainmentProcedures = `???`;
        else {
            specialContainmentProcedures = specialContainmentProcedures.trim();
            specialContainmentProcedures = genUtils.shrinkString(specialContainmentProcedures, 1024, true);
        }

        if (!description) description = `???`;
        else {
            description = description.trim();
            description = genUtils.shrinkString(description, 1024, true);
        }

        let color;
        switch (objectClass) {
            case `Safe`:
                color = `#288f31`;
                break;

            case `Euclid`:
                color = `#dbde23`;
                break;
            
            case `Keter`:
                color = `#de2121`;
                break;
            
            case `Neutralized`:
                color = `#000000`;
                break;
            
            default:
                color = `#919191`;
                break;
        }



        let scpEmbed = new Discord.RichEmbed()
            .setTitle(`SCP-${scpNum}`)
            .setURL(`http://www.scp-wiki.net/scp-${scpNum}`)
            .addField(`SCP Class`, `${objectClass}`)
            .addField(`Special Containment Procedure`, `${specialContainmentProcedures}`)
            .addField(`Description`, `${description}`)
            .setColor(color);
        
        if (scpImageURL) {
            scpEmbed.setThumbnail(scpImageURL);
        }
        
        message.channel.send(scpEmbed);

    });

}

module.exports.help = {
    name: "scp"
}