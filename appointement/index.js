const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const db = require('./models');
const appointementSchema = require('./appointementSchema');
const appointementResolver = require('./appointementResolver');
const app = express();
const port = 5002;

// Use GraphQL to handle requests sent to the /graphql endpoint
app.use('/graphql', graphqlHTTP({
  schema: appointementSchema,
  rootValue: appointementResolver,
  graphiql: true
}));

// Use body-parser to parse HTTP requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Implement REST API
app.get('/appointements', (req, res) => {
  db.all(`SELECT * FROM appointements`, [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/appointement/:id', (req, res) => {
  db.get(`SELECT * FROM appointements WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json(row);
  });
});

app.post('/appointement', (req, res) => {
  const { patientId, doctorId, time, date } = req.body;
  console.log(req.body)
  db.run(`INSERT INTO appointements (patientId, doctorId, time, date) VALUES (?, ?, ?, ?)`, [patientId, doctorId, time, date], (err) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success" });
  });
});

app.put('/appointement/:id', (req, res) => {
  const { patientId, doctorId, time, date } = req.body;
  db.run(`UPDATE appointements SET patientId = ?, doctorId = ?, time = ?, date = ? WHERE id = ?`,
    [patientId, doctorId, time, date, req.params.id], (err) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
    }
    res.json({ "message": "success" });
  });
});

app.delete('/appointement/:id', (req, res) => {
  db.run(`DELETE FROM appointements WHERE id = ?`, [req.params.id], (err) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success" });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
