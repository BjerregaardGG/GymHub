import db from "./connection.js";

const deleteMode = process.argv.includes('delete') // node ./database/createDatabase.js delete in terminal

if (deleteMode) {
    db.exec(`DROP TABLE IF EXISTS users`);
    db.exec(`DROP TABLE IF EXISTS pr_data`);
    db.exec(`DROP TABLE IF EXISTS workouts`);
    db.exec(`DROP TABLE IF EXISTS workout_exercises`);
    db.exec(`DROP TABLE IF EXISTS comments`);
    db.exec(`DROP TABLE IF EXISTS user_relationships`);
}

// DDL
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    image_path TEXT,
    role TEXT CHECK(role IN ('ADMIN', 'TRAINER', 'USER'))
);

CREATE TABLE IF NOT EXISTS user_relationships (
     id INTEGER PRIMARY KEY AUTOINCREMENT, 
     user1_id INTEGER NOT NULL, 
     user2_id INTEGER NOT NULL,  
     FOREIGN KEY (user1_id) REFERENCES users(id),
     FOREIGN KEY (user2_id) REFERENCES users(id),
     UNIQUE (user1_id, user2_id)
);

CREATE TABLE IF NOT EXISTS pr_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    user_id INTEGER NOT NULL UNIQUE,
    bench_press_kg REAL,
    squat_kg REAL,
    deadlift_kg REAL,
    run_5k_min REAL,
    pull_ups_max INTEGER,
    date_recorded TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL, 
    title TEXT NOT NULL,
    description TEXT,
    date_recorded TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workout_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    workout_id INTEGER NOT NULL, 
    name TEXT NOT NULL, 
    sets INTEGER,
    reps INTEGER,
    weight_kg REAL,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     workout_id INTEGER NOT NULL, 
     user_id INTEGER NOT NULL, 
     comment TEXT NOT NULL,
     date_recorded TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, 
     FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE, 
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);


if (deleteMode) {
    db.run(`INSERT INTO users (id, name, email, password, image_path, role) VALUES (1, 'Ole', 'ole@hotmail.dk',
         '$2b$14$qnv9DIMDRErunkw72ZyfuODc./adnNdzyzdNlSCqVv31GfdMZdJZu', 'ole_image.jpg', 'ADMIN')`); // 1234x
    db.run(`INSERT INTO users (id, name, email, password, image_path, role) VALUES (2, 'Nanna', 'nanna@hotmail.dk',
         '$2b$14$vkrt4LlZ0P/JihmaDkAuFukK9C8ODszphqlUjD2y1dic/x3jAmbty', 'nanna_image.jpg', 'USER')`); // 4444kl
    db.run(`INSERT INTO users (id, name, email, password, image_path, role) VALUES (3, 'Thomas', 'thomas@gmail.com',
         '$2b$14$AMBDYttPuznUnZ4biOqV8eUQCxhkXw8F.8QB5n91Ho6PUfGFeWroK', 'thomas_image.jpg', 'USER')`); // 8765ff
    db.run(`INSERT INTO users (id, name, email, password, image_path, role) VALUES (4, 'Phillip', 'phillip@gmail.com',
         '$2b$14$8KOIN.ZsiKUVDxnRolNCYeh7nmAHp3NzQnRNadhCZhq.fltxBgpAy', 'phillip_image.jpg', 'USER')`); // password
    db.run(`INSERT INTO users (id, name, email, password, image_path, role) VALUES (5, 'Olivia', 'olivia@gmail.com',
         '$2b$14$IU5LDgyyivGhKO0sX5Z2/.BR9.CdoJmyVgIHKotl3jvIiD7eiM1Nq', 'olivia_image.jpg', 'ADMIN')`); // youwillneverguess

     // Nanna (2) and Thomas (3) are friends
     db.run(`INSERT INTO user_relationships (user1_id, user2_id) VALUES 
          (2, 3)`);

     db.run(`INSERT INTO user_relationships (user1_id, user2_id) VALUES 
          (2, 1)`);
     
     db.run(`INSERT INTO user_relationships (user1_id, user2_id) VALUES 
          (2, 4)`);
     
     db.run(`INSERT INTO user_relationships (user1_id, user2_id) VALUES 
          (2, 5)`);

     db.run(`INSERT INTO user_relationships (user1_id, user2_id) VALUES 
          (4, 1)`);

     // PR Data
     // Nanna's PR
     db.run(`INSERT INTO pr_data (user_id, bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max)
          VALUES (2, 55.0, 95.0, 110.0, 28.5, 7)`);
     // Thomas' PR
     db.run(`INSERT INTO pr_data (user_id, bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max)
          VALUES (3, 90.0, 140.0, 175.0, 23.0, 15)`);
     // Phillip's PR
     db.run(`INSERT INTO pr_data (user_id, bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max)
          VALUES (4, 75.0, 110.0, 140.0, 35.1, 10)`);

     // Workouts
     db.run(`INSERT INTO workouts (user_id, title, description) VALUES 
          (2, 'Leg Day', 'Squats, lunges, and leg press exercises'),
          (3, 'Chest & Back', 'Bench press, pull-ups, rows'),
          (4, 'Full Body', 'Combination of strength and cardio')`);

     // Workout exercises
     // Nanna's Leg Day
     db.run(`INSERT INTO workout_exercises (workout_id, name, sets, reps, weight_kg) VALUES 
          (1, 'Squat', 4, 10, 60.0),
          (1, 'Lunges', 3, 12, 15.0),
          (1, 'Leg Press', 3, 10, 100.0)`);

     // Thomas' Chest & Back
     db.run(`INSERT INTO workout_exercises (workout_id, name, sets, reps, weight_kg) VALUES
          (2, 'Bench Press', 4, 8, 85.0),
          (2, 'Pull-ups', 3, 12, NULL),
          (2, 'Barbell Rows', 3, 10, 60.0)`);

     // Phillip's Full Body
     db.run(`INSERT INTO workout_exercises (workout_id, name, sets, reps, weight_kg) VALUES
          (3, 'Deadlift', 4, 6, 120.0),
          (3, 'Push-ups', 3, 15, NULL),
          (3, 'Running', 1, 1, NULL)`);

     // Comments
     db.run(`INSERT INTO comments (workout_id, user_id, comment) VALUES
          (1, 2, 'Felt strong today!'),
          (1, 3, 'Great effort! Keep going!'),
          (2, 3, 'Nice weight on bench press!'),
          (3, 4, 'This full body session was tough!'),
          (2, 2, 'I need to improve my pull-ups')`);
}
