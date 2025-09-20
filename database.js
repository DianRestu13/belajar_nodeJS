require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const DB_SOURCE_1 = process.env.DB_SOURCE_1 || "db.sqlite"; // Added a fallback
const DB_SOURCE_2 = process.env.DB_SOURCE_2;

const dbMovies = new sqlite3.Database(DB_SOURCE_1, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log(`berhasil terhubung ke database:${DB_SOURCE_1}`);
    dbMovies.run(
      `CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        director TEXT NOT NULL,
        year INTEGER NOT NULL
      )`,
      (err) => {
        if (!err) {
          console.log("Tabel 'movies' berhasil dibuat. Memasukkan data awal...");
          const insert = "INSERT INTO movies (title, director, year) VALUES (?,?,?)";
          dbMovies.run(insert, ["The Lord of the Rings", "Peter Jackson", 2001]);
          dbMovies.run(insert, ["The Avengers", "Joss Whedon", 2012]);
        } else {
          console.log("Tabel 'movies' sudah ada.");
        }
      }
    );
  }
});

// Membuat koneksi kedua ke database untuk tabel 'directors'
const dbDirectors = new sqlite3.Database(DB_SOURCE_2, (err) => {
    if (err) {
        console.error("Error: ", err.message);
        throw err;
    }

    console.log(`Berhasil terhubung ke database: ${DB_SOURCE_2}`);
    dbDirectors.run(
        `CREATE TABLE IF NOT EXISTS directors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            birthYear INTEGER NOT NULL
        )`,
        (err) => {
            if (!err) {
                console.log("Tabel 'directors' berhasil dibuat. Memasukkan data awal...");
                const insert = "INSERT INTO directors (name, birthYear) VALUES (?,?)";
                dbDirectors.run(insert, ["Dian Restu Khoirunnisa", 2006]);
                dbDirectors.run(insert, ["Cheryl Aurelya", 2005]);
                dbDirectors.run(insert, ["Adelia Fioren", 2004]);
            } else {
                console.log("Tabel 'directors' sudah ada.");
            }
        }
    );
});

module.exports = {
    dbMovies,
    dbDirectors
};``