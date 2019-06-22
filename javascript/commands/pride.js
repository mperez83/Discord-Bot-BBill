const Discord = require("discord.js");
const fs = require("fs");

//Primary sources for color descriptions:
//University of Northern Colorado https://www.unco.edu/gender-sexuality-resource-center/resources/pride-flags.aspx
//SavvyRed's deviantart post https://www.deviantart.com/savvyred/journal/Pride-Flags-Colors-explained-379547414

var flagObjects = {

    "abrosexual": {
        description: `Sexual identity of people whose sexuality is fluid. For example, someone who is abrosexual could be asexual, pansexual, or bisexual.`,
        colors: `The flag was created by a tumblr user named Mod Chad after another anonymous person requested it. The anonymous user said, "could you guys \
        possibly make an abrosexual pride flag?? maybe something along the lines of the typical five color flags that fades from #46D294 to white to #EE1766." \
        It is unknown why this person chose these colors specifically.`
    },
    "agender": {
        description: `Gender identity of someone who does not identify as any gender.`,
        colors: `According to The Gender Wiki's Pride Flag Page: "Both black and white represent the complete absence of gender. Grey represents being \
        semi-genderless. Green represents nonbinary gender, because it is the inverse of purple." It was created by a tumblr user with the screen name transrants \
        in 2014.`
    },
    "allosexual": {
        description: `Sexual identity of someone who experiences sexual attraction; the opposite of asexual.`,
        colors: `Up for interpretation.`
    },
    "androsexual": {
        description: `Sexual identity of someone who is attracted to masculinity.`,
        colors: `Up for interpretation.`
    },
    "apothisexual": {
        description: `Sexual identity of someone who does not experience sexual attraction, and also finds sex significantly unappealing.`,
        colors: `Up for interpretation.`
    },
    "aromantic": {
        description: `Romantic identity of someone who experiences no romantic attraction to others.`,
        colors: `Dark Green: Represents aromanticism. Light Green: Represents the aromantic spectrum. \
        White: Represents platonic and aesthetic attraction, as well as queer/quasi platonic relationships. \
        Grey: Represents grey-aromantic and demiromantic people. Black: Represents the sexuality spectrum.`
    },
    "asexual": {
        description: `Sexual identity of someone who does not experience sexual attraction.`,
        colors: `Black: Asexuality. Grey: Grey-asexuality and demi-sexuality. White: Non-asexual partners and allies. Purple: Community.`
    },
    "bisexual": {
        description: `Sexual identity of someone who is attracted to two genders (typically male and female).`,
        colors: `Pink represents the attraction to females, blue represents the attraction to males, and purple represents the attraction to both. \
        Another interpretation is simply that pink is one unspecified gender, blue is another unspecified gender, and purple is both.`
    },
    "catgirl who spilled her orange juice": {
        description: `abebbeabaebbebab`,
        colors: `meaning`
    },
    "ceterosexual": {
        description: `Sexual identity of someone who is only attracted to people that identify as nonbinary (synonymous with skoliosexual).`,
        colors: `Yellow represents being non-binary or attracted to non-binary people. Green represents bigender, third gender, genderqueer, or other genders. \
        White and black represent neutral genderlessness, agender, questioning gender identity, etc. Lavender represents love outside the gender norms.`
    },
    "cupiosexual": {
        description: `Sexual identity of someone who does not experience sexual attraction, but still desires a sexual relationship.`,
        colors: `Up for interpretation.`
    },
    "demiboy": {
        description: `Gender identity of someone who is only partly male.`,
        colors: `Flag was created by a tumblr user with the screen name Transrants. According to Nonbinary.org's Demigender page, the colors mean: \
        "Blue: male. White: agender or nonbinary gender. Grey: partial."`
    },
    "demigirl": {
        description: `Gender identity of someone who is only partly female.`,
        colors: `Flag was created by a tumblr user with the screen name Transrants.  According to Nonbinary.org's Demigender page, the colors mean: \
        "Pink: female. White: agender or nonbinary gender.  Grey: partial."`
    },
    "demisexual": {
        description: `Sexual identity of someone who does not experience sexual attraction until they form a strong emotional connection to someone.`,
        colors: `Black represents asexuality. Grey represents Gray-Ace and demisexuality. White represents sexuality. Purple represents community.`
    },
    "dumb bitch pride": {
        description: `all of us`,
        colors: `meaning`
    },
    "gay": {
        description: `Sexual identity of someone who is attracted to people of the same sex/gender. Also used as a catch-all for the \
        LGBTQA+ community (Lesbian, Gay, Bisexual, Transgender, Questioning/Queer, Asexual, and anything else that falls under LGBTQA+).`,
        colors: `Red: Life. Orange: Healing. Yellow: Sunlight. Green: Nature. Blue: Harmony/Peace. Violet: Spirit.`
    },
    "genderfluid": {
        description: `Gender identity of someone whose gender is not fixed. For example, someone who is genderfluid could identify as male one day, \
        nonbiniary another day, and so on.`,
        colors: `Pink represents femininity. White represents all genders. Purple represents masculinity and femininity. Black represents genderlessness. \
        Blue stands for masculinity.`
    },
    "genderqueer": {
        description: `Gender identity of someone whose gender does not fit within the male/female binary (synonymous with nonbinary).`,
        colors: `Lavender: Mixture of “blue” and “pink”. Represents androgyny, and people who identify as a mixture of female and male. White: Represents \
        agender people. Dark Chartreuse Green: The inverse of lavender. Represents people who identify outside of and without reference to the gender binary.`
    },
    "graysexual": {
        description: `Sexual identity of someone who sometimes experiences sexual attraction, and sometimes doesn't.`,
        colors: `Created by Shikku27316 as a proposed flag. "My original explanation was kinda dumb. The purple was asexuality, the white was allosexuality, \
        and the grey was the region of "getting over" asexuality, and then "getting over" allosexuality to be asexual again, but that sounds pretty dumb, \
        plus it's not the only definition of greysexual. So, the colours mean the same, but it's kinda symbolising the two coming together to make the grey area."`
    },
    "intersex": {
        description: `Someone who is born with physical sex characteristics that don’t fit the traditional definitions for male or female bodies.`,
        colors: `Purple: Used because it’s seen as a gender neutral color. Yellow: Used because it’s seen as a gender neutral color. Circle: Represents \
        wholeness, completeness, and the intersex people’s potentiality.`
    },
    "lesbian": {
        description: `Someone who identifies as a woman, and is attracted to women.`,
        colors: `Unknown :(`
    },
    "nonbinary": {
        description: `Gender identity of someone who does not fit within the male/female binary (synonymous with genderqueer).`,
        colors: `Yellow is for gender without reference to the gender binary. White: those with many or all genders. Purple: a mix of female and male. Black: without gender.`
    },
    "omnisexual": {
        description: `Sexual identity of someone who can be attracted to any gender. Unlike pansexuals, omnisexuals still care about the gender their \
        partner identifies as.`,
        colors: `Up for interpretation.`
    },
    "pansexual": {
        description: `Sexual identity of someone who can be attracted to any gender. Unlike omnisexuals, pansexuals are described as "gender-blind", \
        in that they do not care about the gender of their partner.`,
        colors: `Pink: Representing attraction to those who identify as female. Yellow: Representing attraction to those who identify as genderqueer, non-binary, \
        agender, androgynous, or anyone who doesn’t identify on the male-female binary. Blue: Representing attraction to those who identify as male.`
    },
    "parasexual": {
        description: `Sexual identity of someone who does not experience sexual attraction, but still enjoys recreational sex.`,
        colors: `Up for interpretation.`
    },
    "polyamory": {
        description: `The practice of engaging in multiple sexual relationships with the consent of all people involved.`,
        colors: `Blue represents openness and honesty between all lovers involved in each relationship. Red represents love and passion. Black represents all \
        people in open and consensual relationships who have to hide their relationships due to social discrimination. The golden pi represents the value \
        placed on emotional attachments to others.`
    },
    "polysexual": {
        description: `Sexual identity of someone who is attracted to multiple, but not all, genders.`,
        colors: `Pink represents attraction to females. Blue represents attraction to males. Green (most likely) represents attraction to people with non-binary gender identities.`
    },
    "rabiosexual": {
        description: `Sexual identity of someone who is attracted to people with rabies.`,
        colors: `it's a joke`
    },
    "shit eating brain fungus": {
        description: `Flag of the lads.`,
        colors: `Blue: Michael. Green: Vincent. Neon yellow/neon green: Hazmat suit person cleaning up fungus. Orange: Kordell. Red: Bianca.`
    },
    "transgender": {
        description: `Gender identity of someone whose gender does not align with the sex they were assigned at birth.`,
        colors: `Light Blue: Represents the traditional color for boys. Light Pink: Represents the traditional color for girls. White: Represents \
        those who are intersex, transitioning, or see themselves as having a neutral or undefined gender.`
    }

};



module.exports.run = async (bot, message, args) => {
    
    let flags = [];
    fs.readdirSync("./graphics/pride flags/").forEach(file => {
        flags.push(file);
    });

    let randomIndex = Math.floor(Math.random() * flags.length);

    let stats = fs.statSync("./graphics/pride flags/" + flags[randomIndex]);
    let fileSize = (stats["size"] / 1000000.0).toFixed(2);

    if (fileSize > 8) {
        message.channel.send(`That flag is **${fileSize}mb** big, I physically cannot upload that (this message should never appear)`);
        return;
    }

    let fileName = flags[randomIndex].replace(/\.[^/.]+$/, "");
    let newEmbed = new Discord.RichEmbed()
        .setTitle(`${fileName}`)
        .addField("Description", flagObjects[fileName].description)
        .addField("Colors", flagObjects[fileName].colors)
        .attachFile("./graphics/pride flags/" + flags[randomIndex]);

    message.channel.send(newEmbed);

}

module.exports.help = {
    name: "pride"
}