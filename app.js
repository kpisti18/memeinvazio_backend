// telepített csomagok importálása
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// általunk elkészített csomagok importálása
const authenticateToken = require('./middleware/jwtAuth');

// útvonalak importálása
const authRoutes = require('./routes/authRoutes'); // auth útvonalak
const likeRoutes = require('./routes/likeRoutes'); // like/unlike útvonalak
const memeRoutes = require('./routes/memeRoutes'); // meme útvonalak
const profileRoutes = require('./routes/profileRoutes'); // profil útvonalak

const app = express();

// middleware konfigurációk
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'https://memeinvazio.netlify.app',
    credentials: true
}));

// statikus fájlok elérése
app.use('/uploads', authenticateToken, express.static(path.join(__dirname, 'uploads')));

// az útvonalak használata
app.use('/api/auth', authRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/memes', memeRoutes);
app.use('/api/profile', profileRoutes);

module.exports = app;