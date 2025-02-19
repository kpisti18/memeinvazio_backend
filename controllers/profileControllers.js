const db = require('../models/db');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// porfilkép módosítása
const editProfilePic = (req, res) => {
    const user_id = req.user.id;
    const profile_pic = req.file ? req.file.filename : null;

    //console.log(user_id, profile_pic);
    const sql = 'UPDATE users SET profile_pic = COALESCE(NULLIF(?, ""), profile_pic) WHERE user_id = ?';

    db.query(sql, [profile_pic, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL-ben' });
        }

        return res.status(200).json({ message: 'Profilkép frissítve' });
    });
};

// profilkép megjelenítése
const getProfilePic = (req, res) => {
    const user_id = req.user.id;

    const sql = 'SELECT profile_pic FROM users WHERE user_id = ?';
    db.query(sql, [user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL-ben' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'A felhasználó nem található' });
        }

        return res.status(200).json(result);
    });
};

const editProfileName = (req, res) => {
    const user_id = req.user.id;
    const name = req.body.name;

    //console.log(user_id, name);
    const sql = 'UPDATE users SET name = COALESCE(NULLIF(?, ""), name) WHERE user_id = ?';

    db.query(sql, [name, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL-ben' });
        }

        return res.status(200).json({ message: 'Profil név módosítva' });
    });
};

// a profil jelszavának módosítása
const editProfilePsw = (req, res) => {
    const user_id = req.user.id;
    const psw = req.body.psw;
    const salt = 10;

    console.log(user_id, psw);
    if (psw === '' || !validator.isLength(psw, { min: 6 })) {
        return res.status(400).json({ error: 'A jelszónak min 6 karakterből kell állnia!' });
    }

    bcrypt.hash(psw, salt, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba a sózáskor!' });
        }

        const sql = 'UPDATE users SET psw = COALESCE(NULLIF(?, ""), psw) WHERE user_id = ?';

        db.query(sql, [hash, user_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Hiba az SQL-ben' });
            }

            return res.status(200).json({ message: 'Jelszó módosítva! Most kijelentkeztetlek.' });
        });
    });
};

module.exports = { editProfilePic, getProfilePic, editProfileName, editProfilePsw };