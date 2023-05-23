const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const db = require('./models');
const doctorSchema = require('./doctorSchema');
const doctorResolver = require('./doctorResolver');

const app = express();
const port = 5000;

app.use('/graphql', graphqlHTTP({
  schema: doctorSchema,
    rootValue: doctorResolver,
    graphiql: true
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/doctors', (req, res) => {
  db.all(`SELECT * FROM doctors`, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/doctor/:id', (req, res) => {
  db.get(`SELECT * FROM doctors WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json(row);
  });
});

app.post('/doctor', (req, res) => {
  const { name, lastName, phone } = req.body;
  console.log(req.body)
  db.run(`INSERT INTO doctors (name, lastName, phone) VALUES (?, ?, ?)`, [name,
    lastName, phone], (err) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({ "message": "success" });
    });
});

app.put('/doctor/:id', (req, res) => {
  const { name, lastName, phone } = req.body;
  db.run(`UPDATE doctors SET name = ?, lastName = ?, phone = ? WHERE id = ?`,
    [name, lastName, phone, req.params.id], (err) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({ "message": "success" });
    });
});

app.delete('/doctor/:id', (req, res) => {
  db.run(`DELETE FROM doctors WHERE id = ?`, [req.params.id], (err) => {
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
