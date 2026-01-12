import db from "./connection.js";

const deleteMode = process.argv.includes('delete') // node ./database/createDatabase.js delete in terminal

if (deleteMode) {
    db.exec(`DROP TABLE IF EXISTS users`);
    db.exec(`DROP TABLE IF EXISTS pr_data`);
    db.exec(`DROP TABLE IF EXISTS workouts`);
    db.exec(`DROP TABLE IF EXISTS workout_exercises`);
    db.exec(`DROP TABLE IF EXISTS comments`);
    db.exec(`DROP TABLE IF EXISTS follow_requests`);
}

// DDL
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    image_path TEXT,
    is_private INTEGER NOT NULL DEFAULT 0, 
    role TEXT CHECK(role IN ('ADMIN', 'USER')) DEFAULT 'USER'
);

CREATE TABLE IF NOT EXISTS follow_requests (
     id INTEGER PRIMARY KEY AUTOINCREMENT, 
     sender_id INTEGER NOT NULL, 
     reciever_id INTEGER NOT NULL,  
     status TEXT NOT NULL CHECK(status IN ('PENDING', 'ACCEPTED', 'DECLINED')),
     date_sent TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (sender_id) REFERENCES users(id),
     FOREIGN KEY (reciever_id) REFERENCES users(id),
     UNIQUE (sender_id, reciever_id)
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
     date_recorded TEXT NOT NULL DEFAULT (datetime('now','localtime')),
     FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE, 
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);


if (deleteMode) {
    db.run(`INSERT INTO users (id, name, email, password, image_path, is_private, role) VALUES (1, 'Ole', 'ole@hotmail.dk',
         '$2b$14$qnv9DIMDRErunkw72ZyfuODc./adnNdzyzdNlSCqVv31GfdMZdJZu', '/uploads/ole_image.jpg', 0, 'ADMIN')`); // 1234x
    db.run(`INSERT INTO users (id, name, email, password, image_path, is_private, role) VALUES (2, 'Nanna', 'nanna@hotmail.dk',
         '$2b$14$vkrt4LlZ0P/JihmaDkAuFukK9C8ODszphqlUjD2y1dic/x3jAmbty', '/uploads/nanna_image.jpg', 0, 'USER')`); // 4444kl
    db.run(`INSERT INTO users (id, name, email, password, image_path, is_private, role) VALUES (3, 'Thomas', 'thomas@gmail.com',
         '$2b$14$AMBDYttPuznUnZ4biOqV8eUQCxhkXw8F.8QB5n91Ho6PUfGFeWroK', '/uploads/thomas_image.jpg', 0, 'USER')`); // 8765ff
    db.run(`INSERT INTO users (id, name, email, password, image_path, is_private, role) VALUES (4, 'Phillip', 'phillip@gmail.com',
         '$2b$14$8KOIN.ZsiKUVDxnRolNCYeh7nmAHp3NzQnRNadhCZhq.fltxBgpAy', '/uploads/phillip_image.jpg', 0, 'USER')`); // password
    db.run(`INSERT INTO users (id, name, email, password, image_path, is_private, role) VALUES (5, 'Olivia', 'olivia@gmail.com',
         '$2b$14$IU5LDgyyivGhKO0sX5Z2/.BR9.CdoJmyVgIHKotl3jvIiD7eiM1Nq', '/uploads/olivia_image.jpg', 1, 'ADMIN')`); // youwillneverguess

     // Nanna (2) is following Thomas (3)
     db.run(`INSERT INTO follow_requests (sender_id, reciever_id, status) VALUES 
          (2, 3, 'ACCEPTED')`);

     db.run(`INSERT INTO follow_requests (sender_id, reciever_id, status) VALUES 
          (2, 1, 'ACCEPTED')`);
     
     db.run(`INSERT INTO follow_requests (sender_id, reciever_id, status) VALUES 
          (2, 4, 'ACCEPTED')`);
     
     db.run(`INSERT INTO follow_requests (sender_id, reciever_id, status) VALUES 
          (2, 5, 'ACCEPTED')`);

     db.run(`INSERT INTO follow_requests (sender_id, reciever_id, status) VALUES 
          (4, 1, 'ACCEPTED')`);

     const prData = [
        { user_id: 1, bench_press: 80, squat: 120, deadlift: 150, run5k: 25, pullUps: 10 },
        { user_id: 2, bench_press: 55, squat: 95, deadlift: 110, run5k: 28.5, pullUps: 7 },
        { user_id: 3, bench_press: 90, squat: 140, deadlift: 175, run5k: 23, pullUps: 15 },
        { user_id: 4, bench_press: 75, squat: 110, deadlift: 140, run5k: 35.1, pullUps: 10 },
        { user_id: 5, bench_press: 65, squat: 100, deadlift: 130, run5k: 30, pullUps: 8 }
     ];

     prData.forEach(pr => {
          db.run(`
              INSERT INTO pr_data 
              (user_id, bench_press_kg, squat_kg, deadlift_kg, run_5k_min, pull_ups_max)
              VALUES (?, ?, ?, ?, ?, ?)`,
              pr.user_id, pr.bench_press, pr.squat, pr.deadlift, pr.run5k, pr.pullUps
          );
     });

     const users = [1,2,3,4,5];

     const workoutsTemplate = [
          { title: "Leg Day", description: "Squats, lunges, leg press", exercises: [
               { name: "Squat", sets: 4, reps: 10, weight_kg: 60 },
               { name: "Lunges", sets: 3, reps: 12, weight_kg: 20 },
               { name: "Leg Press", sets: 3, reps: 10, weight_kg: 100 },
          ]},
          { title: "Chest & Back", description: "Bench press, pull-ups, rows", exercises: [
               { name: "Bench Press", sets: 4, reps: 8, weight_kg: 50 },
               { name: "Pull-ups", sets: 3, reps: 10, weight_kg: null },
               { name: "Rows", sets: 3, reps: 12, weight_kg: 40 },
          ]},
          { title: "Cardio & Core", description: "Running, planks", exercises: [
               { name: "Running", sets: 1, reps: 1, weight_kg: null },
               { name: "Planks", sets: 3, reps: 1, weight_kg: null },
          ]},
     ];

     let workoutId = 1;

     users.forEach(user_id => {
          workoutsTemplate.forEach(w => {
               db.run(`
                    INSERT INTO workouts (user_id, title, description)
                    VALUES (?, ?, ?)`,
                    user_id, w.title, w.description
               );

               w.exercises.forEach(ex => {
                    db.run(`
                         INSERT INTO workout_exercises (workout_id, name, sets, reps, weight_kg)
                         VALUES (?, ?, ?, ?, ?)`,
                         workoutId, ex.name, ex.sets, ex.reps, ex.weight_kg
                    );
               });

               workoutId++;
          });
     });

     // Comments
     db.run(`INSERT INTO comments (workout_id, user_id, comment) VALUES
          (1, 2, 'Felt strong today!'),
          (1, 3, 'Great effort! Keep going!'),
          (2, 3, 'Nice weight on bench press!'),
          (3, 4, 'This full body session was tough!'),
          (4, 3, 'Nice job! That one looked tough!'), 
          (4, 1, 'Wow!'), 
          (5, 3, 'That one is nice!'),
          (2, 2, 'I need to improve my pull-ups')`);
}
