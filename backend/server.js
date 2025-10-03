const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize SQLite database
const dbPath = path.join(__dirname, 'slang_dictionary.db');
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slang_word TEXT UNIQUE NOT NULL,
      standard_word TEXT NOT NULL,
      word_type TEXT NOT NULL DEFAULT 'slovo',
      grammatical_info TEXT,
      genitive_form TEXT,
      meaning TEXT NOT NULL,
      examples TEXT,
      diminutives TEXT,
      adjectives TEXT,
      category TEXT DEFAULT 'obecné',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Routes
app.get('/api/words', (req, res) => {
  db.all('SELECT * FROM words ORDER BY slang_word ASC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows);
    }
  });
});

app.get('/api/word/:slang', (req, res) => {
  db.get('SELECT * FROM words WHERE slang_word = ?', [req.params.slang], (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Word not found' });
    }
  });
});

app.get('/api/search/:query', (req, res) => {
  const query = `%${req.params.query}%`;
  const wordType = req.query.type; // 'slovo', 'zkratka', or 'all'
  
  let sql = 'SELECT * FROM words WHERE (slang_word LIKE ? OR standard_word LIKE ?)';
  let params = [query, query];
  
  if (wordType && wordType !== 'all') {
    sql += ' AND word_type = ?';
    params.push(wordType);
  }
  
  sql += ' ORDER BY slang_word ASC';
  
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/words', (req, res) => {
  const { slang_word, standard_word, word_type, grammatical_info, genitive_form, meaning, examples, diminutives, adjectives, category } = req.body;
  db.run('INSERT INTO words (slang_word, standard_word, word_type, grammatical_info, genitive_form, meaning, examples, diminutives, adjectives, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [slang_word, standard_word, word_type, grammatical_info, genitive_form, meaning, examples, diminutives, adjectives, category], 
    function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          res.status(400).json({ error: 'Word already exists' });
        } else {
          res.status(500).json({ error: 'Database error' });
        }
      } else {
        res.json({ id: this.lastID, message: 'Word added successfully' });
      }
    }
  );
});

// Handle Chrome DevTools requests
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  // Skip API routes and static files
  if (req.path.startsWith('/api/') || req.path.includes('.')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});