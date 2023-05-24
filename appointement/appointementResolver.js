// appointementResolver.js

const db = require('./models');

// Implementation of the GraphQL resolvers
const appointementResolver = {
  appointment: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM appointments WHERE id = ?`, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },
  appointments: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM appointments`, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  addAppointment: ({ patientId, doctorId, time, date }) => {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO appointments (patientId, doctorId, time, date) VALUES (?, ?, ?, ?)`, [patientId, doctorId, time, date], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, patientId, doctorId, time, date });
        }
      });
    });
  },

updateAppointemet: ({ id, patientId, doctorId, time, date }) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE appointemets SET patientId = ?, doctorId = ?, time = ?, date = ? WHERE id = ?',
        [patientId, doctorId, time, date, id],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id, patientId, doctorId, time, date });
          }
        }
      );
    });
  },

deleteAppointemet: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM appointemets WHERE id = ?`, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(`appointement avec l'ID ${id} supprimé.`);
        }
      });
    });
  }
};
module.exports = appointementResolver;