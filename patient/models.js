const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./patients.sqlite', err => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Database connected.');
});

// Create the patients table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  lastName TEXT NOT NULL,
  phone NUMBER NOT NULL UNIQUE
)`);

// Define the Patient class
class Patient {
  constructor(name, lastName, phone) {
    this.name = name;
    this.lastName = lastName;
    this.phone = phone;
  }

  // Save a new patient to the database
  save(callback) {
    db.run(
      `INSERT INTO patients (name, lastName, phone) VALUES (?, ?, ?)`,
      [this.name, this.lastName, this.phone],
      function(err) {
        if (err) {
          console.error(err.message);
          return callback(err);
        }
        console.log(`patient ${this.name} added with the ID: ${this.lastID}`);
        callback(null, this.lastID);
      }
    );
  }

  // Find all patients in the database and return them as Patient objects
  static findAll(callback) {
    db.all(`SELECT * FROM patients`, [], function(err, rows) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      const patients = rows.map(
        row => new Patient(row.name, row.lastName, row.phone)
      );
      callback(null, patients);
    });
  }

  // Find a patient by ID and return it as a Patient object
  static findById(id, callback) {
    db.get(`SELECT * FROM patients WHERE id = ?`, [id], function(err, row) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      if (!row) {
        return callback(new Error('patient not found'));
      }
      const patient = new Patient(row.name, row.lastName, row.phone);
      callback(null, patient);
    });
  }

  // Update a patient by ID with the provided information
  updateById(id, name, lastName, phone, callback) {
    db.run(
      `UPDATE patients SET name = ?, lastName = ?, phone = ? WHERE id = ?`,
      [name, lastName, phone, id],
      function(err) {
        if (err) {
          console.error(err.message);
          return callback(err);
        }
        console.log(`patient with the ID: ${id} has been updated.`);
        callback(null);
      }
    );
  }

  // Delete a patient by ID
  deleteById(id, callback) {
    db.run(`DELETE FROM patients WHERE id = ?`, [id], function(err) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      console.log(`the patient with the ID: ${id} has been deleted`);
      callback(null);
    });
  }
}

// Export the database object for use in other parts of the application
module.exports = db;
