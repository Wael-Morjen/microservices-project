const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./doctors.sqlite', err => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Database connected.');
});

// Create the doctors table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS doctors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  lastName TEXT NOT NULL,
  phone NUMBER NOT NULL UNIQUE
)`);

// Define the Doctor class
class Doctor {
  constructor(name, lastName, phone) {
    this.name = name;
    this.lastName = lastName;
    this.phone = phone;
  }

  // Save a new Doctor to the database
  save(callback) {
    db.run(
      `INSERT INTO doctors (name, lastName, phone) VALUES (?, ?, ?)`,
      [this.name, this.lastName, this.phone],
      function(err) {
        if (err) {
          console.error(err.message);
          return callback(err);
        }
        console.log(`doctor ${this.name} added with the ID: ${this.lastID}`);
        callback(null, this.lastID);
      }
    );
  }

  // Find all doctors in the database and return them as Doctor objects
  static findAll(callback) {
    db.all(`SELECT * FROM doctors`, [], function(err, rows) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      const doctors = rows.map(
        row => new Doctor(row.name, row.lastName, row.phone)
      );
      callback(null, doctors);
    });
  }

  // Find a Doctor by ID and return it as a Doctor object
  static findById(id, callback) {
    db.get(`SELECT * FROM doctors WHERE id = ?`, [id], function(err, row) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      if (!row) {
        return callback(new Error('Doctor not found'));
      }
      const doctor = new Doctor(row.name, row.lastName, row.phone);
      callback(null, doctor);
    });
  }

  // Update a doctor by ID with the provided information
  updateById(id, name, lastName, phone, callback) {
    db.run(
      `UPDATE doctors SET name = ?, lastName = ?, phone = ? WHERE id = ?`,
      [name, lastName, phone, id],
      function(err) {
        if (err) {
          console.error(err.message);
          return callback(err);
        }
        console.log(`doctor with the ID: ${id} has been updated.`);
        callback(null);
      }
    );
  }

  // Delete a doctor by ID
  deleteById(id, callback) {
    db.run(`DELETE FROM doctors WHERE id = ?`, [id], function(err) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      console.log(`the doctor with the ID: ${id} has been deleted`);
      callback(null);
    });
  }
}

// Export the database object for use in other parts of the application
module.exports = db;