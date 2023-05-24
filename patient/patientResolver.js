const db = require('./models');

const patientResolver = {
  getPatientById: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM patients WHERE id = ?`,
        [id], 
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  },

  getAllPatients: () => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM patients`, 
        [], 
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  },

  addPatient: ({ name, lastName, phone }) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO patients (name, lastName, phone) VALUES (?, ?, ?)`,
        [name, lastName, phone],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, name, lastName, phone });
          }
        }
      );
    });
  },

  updatePatient: ({ id, name, lastName, phone }) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE patients SET name = ?, lastName = ?, phone = ? WHERE id = ?',
        [name, lastName, phone, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, name, lastName, phone });
          }
        }
      );
    });
  },

  deletePatient: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM patients WHERE id = ?`,
        [id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(`patient with id ${id} deleted.`);
          }
        }
      );
    });
  }
};

module.exports = patientResolver;
