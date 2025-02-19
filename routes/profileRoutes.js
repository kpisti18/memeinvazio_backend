const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const upload = require('../middleware/multer');
const { editProfilePic, getProfilePic, editProfileName, editProfilePsw } = require('../controllers/profileControllers');

const router = express.Router();

router.put('/editProfilePic', authenticateToken, upload.single('profile_pic'), editProfilePic);
router.get('/getProfilePic', authenticateToken, getProfilePic);
router.put('/editProfileName', authenticateToken, editProfileName);
router.put('/editProfilePsw', authenticateToken, editProfilePsw);

module.exports = router;