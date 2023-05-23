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

  addPatient: ({ name, email, phone }) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO patients (name, email, phone) VALUES (?, ?, ?)`,
        [name, email, phone],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, name, email, phone });
          }
        }
      );
    });
  },

  updatePatient: ({ id, name, email, phone }) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE patients SET name = ?, email = ?, phone = ? WHERE id = ?',
        [name, email, phone, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, name, email, phone });
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
