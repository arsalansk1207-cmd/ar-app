const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const MAPPINGS_FILE = path.join(__dirname, '..', 'mappings.json');

function getMappings() {
  try { return JSON.parse(fs.readFileSync(MAPPINGS_FILE, 'utf8')); }
  catch(e) { return []; }
}
function saveMappings(data) {
  fs.writeFileSync(MAPPINGS_FILE, JSON.stringify(data, null, 2));
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isVideo = file.mimetype.startsWith('video/');
    const isImage = file.mimetype.startsWith('image/');
    if (isVideo) return cb(null, path.join(__dirname, '..', 'public', 'uploads', 'videos'));
    if (isImage) return cb(null, path.join(__dirname, '..', 'public', 'uploads', 'qrcodes'));
    cb(new Error('Invalid file type'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/gif','image/webp','video/mp4','video/webm','video/ogg','video/quicktime'];
    cb(null, allowed.includes(file.mimetype));
  }
});

router.get('/mappings', (req, res) => {
  res.json(getMappings());
});

router.post('/upload', upload.fields([
  { name: 'targetimage', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), (req, res) => {
  try {
    const { title } = req.body;
    const targetFile = req.files['targetimage'] ? req.files['targetimage'][0] : null;
    const videoFile = req.files['video'] ? req.files['video'][0] : null;

    if (!videoFile) return res.status(400).json({ error: 'Video file is required' });
    if (!targetFile) return res.status(400).json({ error: 'Target image file is required' });

    const mappings = getMappings();
    const entry = {
      id: uuidv4(),
      title: title || 'Untitled',
      targetImageUrl: '/uploads/qrcodes/' + targetFile.filename,
      videoUrl: '/uploads/videos/' + videoFile.filename,
      videoName: videoFile.originalname,
      targetImageName: targetFile.originalname,
      createdAt: new Date().toISOString()
    };

    mappings.push(entry);
    saveMappings(mappings);
    res.json({ success: true, entry });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/mappings/:id', (req, res) => {
  let mappings = getMappings();
  const entry = mappings.find(m => m.id === req.params.id);
  if (!entry) return res.status(404).json({ error: 'Not found' });
  [entry.qrImageUrl, entry.videoUrl].forEach(url => {
    if (url) {
      const fp = path.join(__dirname, '..', 'public', url);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
  });
  mappings = mappings.filter(m => m.id !== req.params.id);
  saveMappings(mappings);
  res.json({ success: true });
});

router.get('/scanner-mappings', (req, res) => {
  const mappings = getMappings();
  res.json(mappings.map(m => ({
    id: m.id,
    title: m.title,
    targetImageUrl: m.targetImageUrl,
    videoUrl: m.videoUrl
  })));
});

module.exports = router;
