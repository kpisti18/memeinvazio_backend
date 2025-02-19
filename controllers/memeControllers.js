const db = require('../models/db');

// az összes meme lekérdezése
const getMemes = (req, res) => {
    const user_id = req.user.id;
    const sql = 'SELECT uploads.upload_id, uploads.meme, uploads.user_id, users.name, users.profile_pic, COUNT(likes.upload_id) AS`like`, CASE WHEN EXISTS(SELECT 1 FROM likes WHERE likes.upload_id = uploads.upload_id AND likes.user_id = ?) THEN 1 ELSE 0 END AS alreadyLiked FROM uploads JOIN users ON uploads.user_id = users.user_id LEFT JOIN likes ON uploads.upload_id = likes.upload_id GROUP BY uploads.upload_id';

    db.query(sql, [user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL-ben', err });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'Nincs még meme' });
        }

        return res.status(200).json(result);
    });
};

// új meme feltöltése
const uploadMeme = (req, res) => {
    const user_id = req.user.id;
    const meme = req.file ? req.file.filename : null;

    if (meme === null) {
        return res.status(400).json({ error: 'Válassz ki egy képet' });
    }

    const sql = 'INSERT INTO uploads (upload_id, user_id, meme) VALUES (NULL, ?, ?)';
    db.query(sql, [user_id, meme], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL-ben' });
        }

        return res.status(201).json({ message: 'Kép feltöltve', upload_id: result.insertId });
    });
};

module.exports = { getMemes, uploadMeme };