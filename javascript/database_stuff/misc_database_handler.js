const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/databases/misc_database.sqlite');

sql.pragma("synchronous = 1");
sql.pragma("journal_mode = wal");

verifyTable("pride_data");



function verifyTable(tableToVerify) {
    switch (tableToVerify) {
        
        case "pride_data":
            let prideDataTable = sql.prepare("SELECT * FROM sqlite_master WHERE type='table' AND name='pride_data';").get();
            if (!prideDataTable) {
                console.log(`Table "pride_data" not found! Generating now.`);
                sql.prepare(`CREATE TABLE pride_data (flag_name TEXT, description TEXT, colors TEXT, people_count INTEGER, PRIMARY KEY (flag_name));`).run();
            }
            break;
        
        default:
            console.error(`Error: Attempted to verify unknown table "${tableToVerify}"`);
            break;

    }
}

function getPrideData(flagName) {
    return sql.prepare(`SELECT * FROM pride_data WHERE flag_name="${flagName}"`).get();
}
module.exports.getPrideData = getPrideData;

function setPrideData(updatedFlagEntry) {
    sql.prepare(`INSERT OR REPLACE INTO pride_data (flag_name, description, colors, people_count) VALUES (@flag_name, @description, @colors, @people_count);`).run(updatedFlagEntry);
}
module.exports.setPrideData = setPrideData;

function addPeopleCount(flagName, amount) {
    let flagEntry = getPrideData(flagName);
    flagEntry.people_count += amount;
    setPrideData(flagEntry);
}
module.exports.addPeopleCount = addPeopleCount;