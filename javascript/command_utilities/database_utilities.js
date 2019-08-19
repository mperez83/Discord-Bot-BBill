const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/user_database.sqlite');

verifyTable("power_levels");
verifyTable("command_calls");
verifyTable("misc_info");

//Prepared statements for convenience
const getUserPowerLevelData = sql.prepare("SELECT * FROM power_levels WHERE user_id = ?");
const setUserPowerLevelData = sql.prepare("INSERT OR REPLACE INTO power_levels (user_id, username, power, next_power_check_date, chokes) VALUES (@user_id, @username, @power, @next_power_check_date, @chokes);");
const getAllUserPowerLevelData = sql.prepare("SELECT * FROM power_levels");
const orderByPowerLevel = sql.prepare("SELECT * FROM power_levels ORDER BY power ASC");



function verifyTable(tableToVerify) {
    switch (tableToVerify) {

        case "power_levels":
            //Check if the table "power_levels" exists
            let powerLevelsTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='power_levels';").get();
            if (!powerLevelsTable['count(*)']) {
                console.log(`Table "${tableToVerify}" not found! Generating now.`);
                //If the table isn't there, create it and setup the database correctly
                sql.prepare("CREATE TABLE power_levels (user_id TEXT PRIMARY KEY, username TEXT, power INTEGER, next_power_check_date TEXT, chokes INTEGER);").run();

                //Ensure that the "id" row is always unique and indexed
                //sql.prepare("CREATE UNIQUE INDEX idx_users_id ON power_levels (id);").run();

                //These settings make reading/writing to tables a lot safer (in the event of a crash or power outage, the database will not be corrupted with these settings)
                sql.pragma("synchronous = 1");      //Makes the database sync at the most critical moments, but for the most part remain async
                sql.pragma("journal_mode = wal");   //"Write-Ahead Logging" just makes everything faster I guess
            }
            break;
        
        case "command_calls":
            let commandCallsTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='command_calls';").get();
            if (!commandCallsTable['count(*)']) {
                console.log(`Table "${tableToVerify}" not found! Generating now.`);
                sql.prepare("CREATE TABLE command_calls (user_id TEXT PRIMARY KEY);").run();
                sql.pragma("synchronous = 1");
                sql.pragma("journal_mode = wal");
            }
            break;
        
        case "misc_info":
            let miscInfoTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='misc_info';").get();
            if (!miscInfoTable['count(*)']) {
                console.log(`Table "${tableToVerify}" not found! Generating now.`);
                sql.prepare("CREATE TABLE misc_info (user_id TEXT PRIMARY KEY, billie_bucks INTEGER, garfield_revenance INTEGER, social_deviancy INTEGER, \
                    stealthy_bastard_points INTEGER, ascii_typed INTEGER, wisdom_shared INTEGER, swears_spoken INTEGER, sin INTEGER);").run();
                sql.pragma("synchronous = 1");
                sql.pragma("journal_mode = wal");
            }
            break;
        
        default:
            console.error(`Error: Attempted to verify unknown table "${tableToVerify}"!`);
            break;

    }
}



function getPowerLevelEntry(message) {
    let userEntry = getUserPowerLevelData.get(message.author.id);
    if (!userEntry) {
        userEntry = {
            user_id: message.author.id,
            username: message.author.username,
            power: 0,
            next_power_check_date: undefined,
            chokes: 0
        }
    }
    else {
        if (userEntry.username != message.author.username) userEntry.username = message.author.username;
    }
    return userEntry;
}
module.exports.getPowerLevelEntry = getPowerLevelEntry;

function setPowerLevelEntry(updatedPowerLevelData) {
    setUserPowerLevelData.run(updatedPowerLevelData);
    orderByPowerLevel.run();
}
module.exports.setPowerLevelEntry = setPowerLevelEntry;

function getAllPowerLevelEntries() {
    return getAllUserPowerLevelData.all();
}
module.exports.getAllPowerLevelEntries = getAllPowerLevelEntries;