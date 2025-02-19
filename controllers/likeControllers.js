const db = require('../models/db');

// Like
const likeMeme = (req, res) => {
    const user_id = req.user.id;
    const upload_id = req.params.upload_id;

    const sqlSelect = 'SELECT * FROM likes WHERE upload_id = ? AND user_id = ?';
    db.query(sqlSelect, [upload_id, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL-ben' });
        }

        if (result.length !== 0) {
            return res.status(409).json({ error: 'Már lájkoltad' });
        }

        const sqlInsert = 'INSERT INTO likes (upload_id, user_id) VALUES (?, ?)';
        db.query(sqlInsert, [upload_id, user_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Hiba az SQL-ben' });
            }

            res.status(200).json({ message: 'tetszik' });
        });
    });
};

// unlike
const unlikeMeme = (req, res) => {
    const user_id = req.user.id;
    const upload_id = req.params.upload_id;

    const sql = 'DELETE FROM likes WHERE upload_id = ? AND user_id = ?';
    db.query(sql, [upload_id, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL-ben' });
        }

        return res.status(204).send();
    });
};

module.exports = { likeMeme, unlikeMeme };