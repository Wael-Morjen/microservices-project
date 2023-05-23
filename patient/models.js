const sqlite3 = require('sqlite3').verbose();

// connect to the DB
const db = new sqlite3.Database('./patients.sqlite', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Database connected.');
});

db.run(`CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  lastName TEXT NOT NULL,
  phone NUMBER NOT NULL UNIQUE
)`);


class Patient {
  constructor(name, lastName, phone) {
    this.name = name;
    this.lastName = lastName;
    this.phone = phone;
  }


    // Enregistrer un nouvel client dans la base de données
    save(callback) {
    db.run(`INSERT INTO patients (name, lastName, phone) VALUES (?, ?, ?)`,
    [this.name, this.lastName, this.phone], function(err) {
    if (err) {
    console.error(err.message);
    return callback(err);
    }
    console.log(`patient ${this.name} added with the ID: ${this.lastID}`);
    callback(null, this.lastID);
    });
    }

    // Rechercher tous les clients dans la base de données
    static findAll(callback) {
    db.all(`SELECT * FROM patients`, [], function(err, rows) {
    if (err) {
    console.error(err.message);
    return callback(err);
    }
    const patients = rows.map(row => new Patient(row.name, row.lastName,
    row.phone));
    callback(null, patients);
    });
    }
    
    
    // Rechercher un client par ID dans la base de données
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

    // Mettre à jour un client dans la base de données
    updateById(id, name, lastName, phone, callback) {
    db.run(`UPDATE patients SET name = ?, lastName = ?, phone = ? WHERE id = ?`,
    [name, lastName, phone, id], function(err) {
    if (err) {
    console.error(err.message);
    return callback(err);
    }
    console.log(`patient with the ID: ${id} has been updated.`);
    callback(null);
    });
    }
    // Supprimer un client de la base de données
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
    module.exports = db;