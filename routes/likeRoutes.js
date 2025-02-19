const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const { likeMeme, unlikeMeme } = require('../controllers/likeControllers');

const router = express.Router();

router.post('/like/:upload_id', authenticateToken, likeMeme);
router.delete('/unlike/:upload_id', authenticateToken, unlikeMeme);

module.exports = router;