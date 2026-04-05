const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

['uploads/qrcodes', 'uploads/videos'].forEach(dir => {
  const full = path.join(__dirname, 'public', dir);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

const MAPPINGS_FILE = path.join(__dirname, 'mappings.json');
if (!fs.existsSync(MAPPINGS_FILE)) fs.writeFileSync(MAPPINGS_FILE, '[]');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', require('./routes/api'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'scanner', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

app.listen(PORT, () => {
  console.log('AR Scanner running at http://localhost:' + PORT);
  console.log('Admin panel at http://localhost:' + PORT + '/admin');
});
