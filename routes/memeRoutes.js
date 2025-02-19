const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const upload = require('../middleware/multer');
const { getMemes, uploadMeme } = require('../controllers/memeControllers');

const router = express.Router();

router.get('/getMemes', authenticateToken, getMemes);
router.post('/uploadMeme', authenticateToken, upload.single('meme'), uploadMeme);

module.exports = router;