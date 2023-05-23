const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const db = require('./models');
const patientSchema = require('./patientSchema');
const patientResolver = require('./patientResolver');

const app = express();
const port = 5001;

app.use('/graphql', graphqlHTTP({
  schema: patientSchema,
    rootValue: patientResolver,
    graphiql: true
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/patients', (req, res) => {
  db.all(`SELECT * FROM patients`, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/patient/:id', (req, res) => {
  db.get(`SELECT * FROM patients WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json(row);
  });
});

app.post('/patient', (req, res) => {
  const { name, lastName, phone } = req.body;
  console.log(req.body)
  db.run(`INSERT INTO patients (name, lastName, phone) VALUES (?, ?, ?)`, [name,
    lastName, phone], (err) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({ "message": "success" });
    });
});

app.put('/patient/:id', (req, res) => {
  const { name, lastName, phone } = req.body;
  db.run(`UPDATE patients SET name = ?, lastName = ?, phone = ? WHERE id = ?`,
    [name, lastName, phone, req.params.id], (err) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({ "message": "success" });
    });
});

app.delete('/patient/:id', (req, res) => {
  db.run(`DELETE FROM patients WHERE id = ?`, [req.params.id], (err) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success" });
  });
});

app.listen(port, () => {
  console.log(`server running on port ${port}.`);
});
