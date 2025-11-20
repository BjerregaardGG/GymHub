import db from "./connection.js";

const deleteMode = process.argv.includes('delete') // node ./database/createDatabase.js delete i terminalen 

if (deleteMode) {
    db.exec(`DROP TABLE IF EXISTS users`);
    db.exec(`DROP TABLE IF EXISTS pr_data`)
}

// DDL
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name VARCHAR(50), 
    email VARCHAR(100) UNIQUE,
    password VARCHAR(75),
    role TEXT CHECK( role IN ("ADMIN", "TRAINER", "USER") )
);

CREATE TABLE IF NOT EXISTS pr_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    user_id INTEGER UNIQUE NOT NULL, 
    bench_press_kg REAL,
    squat_kg REAL,
    deadlift_kg REAL,
    run_5k_min REAL,
    pull_ups_max INTEGER,
    date_recorded TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES users_table (id) ON DELETE CASCADE
);
`);

if (deleteMode) {
    db.run(`INSERT INTO users (id, name, email, password, role) VALUES (1, 'Ole', 'ole@hotmail.dk',
         '$2b$14$qnv9DIMDRErunkw72ZyfuODc./adnNdzyzdNlSCqVv31GfdMZdJZu', 'ADMIN')`); // 1234x
    db.run(`INSERT INTO users (id, name, email, password, role) VALUES (2, 'Nanna', 'nanna@hotmail.dk',
         '$2b$14$vkrt4LlZ0P/JihmaDkAuFukK9C8ODszphqlUjD2y1dic/x3jAmbty', 'USER')`); // 4444kl
    db.run(`INSERT INTO users (id, name, email, password, role) VALUES (3, 'Thomas', 'thomas@gmail.com',
         '$2b$14$AMBDYttPuznUnZ4biOqV8eUQCxhkXw8F.8QB5n91Ho6PUfGFeWroK', 'USER')`); // 8765ff
    db.run(`INSERT INTO users (id, name, email, password, role) VALUES (4, 'Phillip', 'phillip@gmail.com',
         '$2b$14$8KOIN.ZsiKUVDxnRolNCYeh7nmAHp3NzQnRNadhCZhq.fltxBgpAy', 'USER')`); // password
    db.run(`INSERT INTO users (id, name, email, password, role) VALUES (5, 'Olivia', 'olivia@gmail.com',
         '$2b$14$IU5LDgyyivGhKO0sX5Z2/.BR9.CdoJmyVgIHKotl3jvIiD7eiM1Nq', 'ADMIN')`); // youwillneverguess

    // Nanna's PR
    db.run(`INSERT INTO pr_data (user_id, bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max)
         VALUES (2, 55.0, 95.0, 110.0, 28.5, 7)`);
    // Thomas' PR
    db.run(`INSERT INTO pr_data (user_id, bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max)
         VALUES (3, 90.0, 140.0, 175.0, 23.0, 15)`);
    // Phillip's PR
    db.run(`INSERT INTO pr_data (user_id, bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max)
         VALUES (4, 75.0, 110.0, 140.0, 35.1, 10)`);
}
