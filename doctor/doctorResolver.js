const db = require('./models');

const doctorResolver = {
  getDoctorById: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM doctors WHERE id = ?`,
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

  getAllDoctors: () => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM doctors`, 
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

  addDoctor: ({ name, lastName, phone }) => {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO doctors (name, lastName, phone) VALUES (?, ?, ?)`,
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

  updateDoctor: ({ id, name, lastName, phone }) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE doctors SET name = ?, lastName = ?, phone = ? WHERE id = ?',
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

  deleteDoctor: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM doctors WHERE id = ?`,
        [id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(`doctor with id ${id} deleted.`);
          }
        }
      );
    });
  }
};

module.exports = doctorResolver;
