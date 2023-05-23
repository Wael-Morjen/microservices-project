
const {
    addPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient
} = require('./models');
// Implémentation Graphql Resolver
const patientResolver = {
customer: ({ id }) => {
return new Promise((resolve, reject) => {
getPatientById(`SELECT * FROM customers WHERE id = ?`, [id], (err, row) => {
if (err) {
reject(err);
} else {
resolve(row);
}
});
});
},
customers: () => {
return new Promise((resolve, reject) => {
db.all(`SELECT * FROM customers`, [], (err, rows) => {
if (err) {
reject(err);
} else {
resolve(rows);
}
});
});
},
addCustomer: ({ name, email, phone }) => {
return new Promise((resolve, reject) => {
db.run(`INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)`,
[name, email, phone], function(err) {
if (err) {
reject(err);
} else {
resolve({ id: this.lastID, name, email, phone });
}
});
});
},

updateCustomer: ({ id, name, email, phone }) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?',
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

deleteCustomer: ({ id }) => {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM customers WHERE id = ?`, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(`Client avec l'ID ${id} supprimé.`);
        }
      });
    });
  }
};
module.exports = patientResolver;