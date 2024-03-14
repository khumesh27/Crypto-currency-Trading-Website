const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Create or open the SQLite database
const db = new sqlite3.Database('wallet.db');

// Create the 'wallet' table if it doesn't exist
db.run('CREATE TABLE IF NOT EXISTS wallet (id INTEGER PRIMARY KEY, balance REAL DEFAULT 0)');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Get current balance
app.get('/balance', (req, res) => {
    db.get('SELECT * FROM wallet WHERE id = 1', (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ balance: row ? row.balance : 0 });
        }
    });
});

// Add funds
app.post('/add-funds', (req, res) => {
    const amount = parseFloat(req.body.amount);

    if (isNaN(amount) || amount <= 0) {
        res.status(400).json({ error: 'Invalid amount' });
        return;
    }

    db.run('UPDATE wallet SET balance = balance + ? WHERE id = 1', [amount], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ success: true });
        }
    });
});

// Withdraw funds
app.post('/withdraw-funds', (req, res) => {
    const amount = parseFloat(req.body.amount);

    if (isNaN(amount) || amount <= 0) {
        res.status(400).json({ error: 'Invalid amount' });
        return;
    }

    db.run('UPDATE wallet SET balance = balance - ? WHERE id = 1', [amount], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ success: true });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
