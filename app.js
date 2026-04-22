const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Initialize SQLite database
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)', (err) => {
            if (!err) {
                // Insert a default message if the table is empty
                db.get('SELECT COUNT(*) as count FROM messages', (err, row) => {
                    if (row.count === 0) {
                        db.run('INSERT INTO messages (text) VALUES (?)', ['Hello from the Cloud-Native DevOps App!']);
                    }
                });
            }
        });
    }
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API Endpoints
app.get('/api/message', (req, res) => {
    db.get('SELECT text FROM messages ORDER BY id DESC LIMIT 1', (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: row ? row.text : 'No messages found.' });
    });
});

app.post('/api/message', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }
    db.run('INSERT INTO messages (text) VALUES (?)', [text], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, text });
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
