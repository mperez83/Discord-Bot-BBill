const genUtils = require("../../command_utilities/general_utilities");

const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');



module.exports.run = async (bot, message, args) => {

    //Check if the user is whitelisted as an admin
    /*try {
        if (!genUtils.verifyWhitelistCommandCall(message, "admin")) return;
    }
    catch (err) {
        console.error(err);
    }



    // Check if the table "points" exists.
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
    if (!table['count(*)']) {
        // If the table isn't there, create it and setup the database correctly.
        sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);").run();
        // Ensure that the "id" row is always unique and indexed.
        sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }

    // And then we have two prepared statements to get and set the score data.
    bot.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
    bot.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");

    let score = bot.getScore.get(message.author.id, message.guild.id);

    if (!score) {
        score = {
            id: `${message.guild.id}-${message.author.id}`,
            user: message.author.id,
            guild: message.guild.id,
            points: 0,
            level: 1
        }
    }

    // Increment the score
    score.points++;

    // Calculate the current level through MATH OMG HALP.
    const curLevel = Math.floor(0.1 * Math.sqrt(score.points));

    // Check if the user has leveled up, and let them know if they have:
    if (score.level < curLevel) {
        // Level up!
        score.level++;
        message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
    }

    bot.setScore.run(score);*/

}

module.exports.help = {
    name: "test",
    description: "Test a specific functionality",
    usage: "!test",
    example: "!test",
    funFacts: [
        "This is an admin command! You probably are not able to use it.",
        "This command changes all the time. It's only used to test very specific functionalities that can't be tested in any other command."
    ]
}