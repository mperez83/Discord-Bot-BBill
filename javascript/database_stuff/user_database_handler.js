const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/databases/user_database.sqlite');

//These settings make reading/writing to tables a lot safer (in the event of a crash or power outage, the database will not be corrupted with these settings)
sql.pragma("synchronous = 1");      //Makes the database sync at the most critical moments, but for the most part remain async
sql.pragma("journal_mode = wal");   //"Write-Ahead Logging" just makes everything faster I guess

verifyTable("power_data");
verifyTable("command_call_data");
verifyTable("misc_data");



function verifyTable(tableToVerify) {
    switch (tableToVerify) {

        case "power_data":
            let powerDataTable = sql.prepare("SELECT * FROM sqlite_master WHERE type='table' AND name='power_data';").get();
            if (!powerDataTable) {
                console.log(`Table "power_data" not found! Generating now.`);
                sql.prepare("CREATE TABLE power_data (user_id TEXT PRIMARY KEY, username TEXT, power INTEGER, power_calls INTEGER, prestige INTEGER, next_power_check_date TEXT, chokes INTEGER);").run();
            }
            break;
        
        case "misc_data":
            let miscInfoTable = sql.prepare("SELECT * FROM sqlite_master WHERE type='table' AND name='misc_data';").get();
            if (!miscInfoTable) {
                console.log(`Table "misc_data" not found! Generating now.`);
                sql.prepare("CREATE TABLE misc_data (user_id TEXT PRIMARY KEY, username TEXT, billie_bucks INTEGER, garfield_revenance INTEGER, social_deviancy INTEGER, \
                    ascii_typed INTEGER, wisdom_shared INTEGER, swears_spoken INTEGER, sin INTEGER);").run();
            }
            break;
        
        case "command_call_data":
            let commandCallsTable = sql.prepare("SELECT * FROM sqlite_master WHERE type='table' AND name='command_call_data';").get();
            if (!commandCallsTable) {
                console.log(`Table "command_call_data" not found! Generating now.`);
                sql.prepare("CREATE TABLE command_call_data (user_id TEXT PRIMARY KEY, username TEXT);").run();
            }
            break;
        
        default:
            console.error(`Error: Attempted to verify unknown table "${tableToVerify}"!`);
            break;

    }
}



//Power data stuff
function getPowerLevelEntry(user) {
    let userEntry = sql.prepare(`SELECT * FROM power_data WHERE user_id=${user.id}`).get();

    if (!userEntry) {
        userEntry = {
            user_id: user.id,
            username: user.username,
            power: 0,
            power_calls: 0,
            prestige: 0,
            next_power_check_date: undefined,
            chokes: 0
        }
    }
    else {
        if (userEntry.username != user.username) userEntry.username = user.username;
    }

    return userEntry;
}
module.exports.getPowerLevelEntry = getPowerLevelEntry;

function setPowerLevelEntry(updatedPowerLevelData) {
    sql.prepare("INSERT OR REPLACE INTO power_data (user_id, username, power, power_calls, prestige, next_power_check_date, chokes) VALUES (@user_id, @username, @power, @power_calls, @prestige, @next_power_check_date, @chokes);").run(updatedPowerLevelData);
}
module.exports.setPowerLevelEntry = setPowerLevelEntry;

function getAllPowerLevelEntries() {
    return sql.prepare("SELECT * FROM power_data ORDER BY power DESC").all();
}
module.exports.getAllPowerLevelEntries = getAllPowerLevelEntries;



//Misc data stuff
function getMiscDataEntry(user) {
    let userEntry = sql.prepare(`SELECT * FROM misc_data WHERE user_id=${user.id}`).get();

    if (!userEntry) {
        userEntry = {
            user_id: user.id,
            username: user.username,
            billie_bucks: 0,
            garfield_revenance: 0,
            social_deviancy: 0,
            ascii_typed: 0,
            wisdom_shared: 0,
            swears_spoken: 0,
            sin: 0
        }
    }
    if (userEntry.username != user.username) userEntry.username = user.username;

    return userEntry;
}
module.exports.getMiscDataEntry = getMiscDataEntry;

function setMiscDataEntry(updatedMiscData) {
    sql.prepare("INSERT OR REPLACE INTO misc_data (user_id, username, billie_bucks, garfield_revenance, social_deviancy, ascii_typed, wisdom_shared, swears_spoken, sin) VALUES (@user_id, @username, @billie_bucks, @garfield_revenance, @social_deviancy, @ascii_typed, @wisdom_shared, @swears_spoken, @sin);").run(updatedMiscData);
}
module.exports.setMiscDataEntry = setMiscDataEntry;

function addMiscDataValue(user, attrib, amount) {
    let userMiscData = getMiscDataEntry(user);

    if (userMiscData[attrib] == undefined) {
        console.error(`Error: ${user.username} attempted access to non-existent attribute '${attrib}'!`);
        return;
    }

    userMiscData[attrib] += amount;
    setMiscDataEntry(userMiscData);
}
module.exports.addMiscDataValue = addMiscDataValue;

function setMiscDataValue(user, attrib, newValue) {
    let userMiscData = getMiscDataEntry(user);

    if (userMiscData[attrib] == undefined) {
        console.error(`Error: attempted access to non-existent attribute '${attrib}'!`);
        return;
    }

    userMiscData[attrib] = newValue;
    setMiscDataEntry(userMiscData);
}
module.exports.setMiscDataValue = setMiscDataValue;



//Command data stuff
function getCommandCallDataEntry(user) {
    let userEntry = sql.prepare(`SELECT * FROM command_call_data WHERE user_id=${user.id}`).get();

    if (!userEntry) {
        userEntry = {};

        let tableColumnData = sql.prepare(`PRAGMA table_info(command_call_data);`).all();
        tableColumnData.forEach((colInfo) => {
            userEntry[colInfo.name] = colInfo.dflt_value;
        });

        userEntry.user_id = user.id;
        userEntry.username = user.username;
    }

    return userEntry;
}
module.exports.getCommandCallDataEntry = getCommandCallDataEntry;

function addCommandNameToTable(commandName) {
    sql.prepare(`ALTER TABLE command_call_data ADD COLUMN ${commandName} INTEGER DEFAULT 0;`).run();
}
module.exports.addCommandNameToTable = addCommandNameToTable;

function updateCommandCallRecord(updatedRecord, colName) {
    let colNames = "";
    let colValues = "";

    Object.keys(updatedRecord).forEach((key, index) => {
        colNames += `${key}, `;
        colValues += `@${key}, `;
    });

    colNames = colNames.slice(0, -2);
    colValues = colValues.slice(0, -2);

    sql.prepare(`INSERT INTO command_call_data (${colNames}) VALUES (${colValues}) ON CONFLICT (user_id) DO UPDATE SET ${colName}="${updatedRecord[colName]}";`).run(updatedRecord);
}
module.exports.updateCommandCallRecord = updateCommandCallRecord;

function incrementCommandCallAmount(user, commandName) {
    let userEntry = getCommandCallDataEntry(user);

    if (userEntry[commandName] == undefined) {
        addCommandNameToTable(commandName);
        userEntry[commandName] = 1;
    }
    else {
        userEntry[commandName]++;
    }

    updateCommandCallRecord(userEntry, commandName);
}
module.exports.incrementCommandCallAmount = incrementCommandCallAmount;