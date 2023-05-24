const sqlite3 = require('sqlite3').verbose();

// Connexion la base de données
const db = new sqlite3.Database('./appointements.sqlite', (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('DB connected');
});

// Création de la table "appointements"
db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientId INTEGER NOT NULL,
    doctorId INTEGER NOT NULL,
    time NUMBER NOT NULL,
    date STRING NOT NULL,
    FOREIGN KEY (patientId) REFERENCES patients(id),
    FOREIGN KEY (doctorId) REFERENCES doctors(id)
  );`);

// Modèle de données pour représenter un appointement
class Appointment {
  constructor(patientId, doctorId, time, date) {
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.time = time;
    this.date = date;
  }
  // Enregistrer un nouveau appointement dans la base de données
  save(callback) {
    db.run(`INSERT INTO appointements (patientId, doctorId, time, date) VALUES (?, ?, ?)`,
      [this.patientId, this.doctorId, this.time, this.date], function(err) {
        if (err) {
          console.error(err.message);
          return callback(err);
        }
        console.log(`appointement ${this.patientId} added with the ID ${this.lastID}`);
        callback(null, this.lastID);
      });
  }
  // Rechercher tous les appointements dans la base de données
  static findAll(callback) {
    db.all(`SELECT * FROM appointements`, [], function(err, rows) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      const appointements = rows.map(row => new Appointment(row.patientId, row.doctorId,
      row.time, row.date));
      callback(null, appointements);
    });
  }
  // Rechercher un appointement par ID dans la base de données
  static findById(id, callback) {
    db.get(`SELECT * FROM appointements WHERE id = ?`, [id], function(err, row) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      if (!row) {
        return callback(new Error('appointement not found'));
      }
      const appointement = new Appointment(row.patientId, row.doctorId, row.time, row.date);
      callback(null, appointement);
    });
  }
  // Mettre à jour un appointement dans la base de données
  static updateById(id, patientId, doctorId, time, date) {
    db.run(`UPDATE appointements SET patientId = ?, doctorId = ?, time = ?, date = ?  WHERE id = ?`,
      [patientId, doctorId, time, date, id], function(err) {
        if (err) {
          console.error(err.message);
          return callback(err);
        }
        console.log(`the appointement with the l'ID ${id} updated.`);
        callback(null);
      });
  }
  // Supprimer un appointement de la base de données
  static deleteById(id, callback) {
    db.run(`DELETE FROM appointements WHERE id = ?`, [id], function(err) {
      if (err) {
        console.error(err.message);
        return callback(err);
      }
      console.log(`appointement with the ID: ${id} deleted.`);
      callback(null);
    });
  }
}

module.exports = db;
