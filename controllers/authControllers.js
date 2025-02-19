const bcrypt = require('bcryptjs');
const validator = require('validator');
const db = require('../models/db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/dotenvConfig').config;

// regisztráció
const register = (req, res) => {
    const { email, name, psw } = req.body;
    const errors = [];

    if (!validator.isEmail(email)) {
        errors.push({ error: 'Nem valós email cím!' });
    }

    if (validator.isEmpty(name)) {
        errors.push({ error: 'Töltsd ki a nevet!' });
    }

    if (!validator.isLength(psw, { min: 6 })) {
        errors.push({ error: 'A jelszónak legalább 6 karakternek kell lennie!' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    bcrypt.hash(psw, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba a hashelés során' });
        }

        const sql = 'INSERT INTO users(user_id, email, name, psw, profile_pic) VALUES(NULL, ?, ?, ?, "default.png")';

        db.query(sql, [email, name, hash], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Az email már foglalt!' });
            }
            res.status(201).json({ message: 'Sikeres regisztráció! ' });
        });
    });
};

// login
const login = (req, res) => {
    const { email, psw } = req.body;
    const errors = [];

    if (!validator.isEmail(email)) {
        errors.push({ error: 'Add meg az email címet ' });
    }

    if (validator.isEmpty(psw)) {
        errors.push({ error: 'Add meg a jelszót' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const sql = 'SELECT * FROM users WHERE email LIKE ?';
    db.query(sql, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Hiba az SQL-ben' });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: 'A felhasználó nem találató' });
        }

        const user = result[0];
        bcrypt.compare(psw, user.psw, (err, isMatch) => {
            if (isMatch) {
                const token = jwt.sign({ id: user.user_id }, JWT_SECRET, { expiresIn: '1y' });
                console.log(token);
                
                res.cookie('auth_token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 1000 * 60 * 60 * 24 * 30 * 12
                });
                

                return res.status(200).json({ message: 'Sikeres bejelentkezés' });
            } else {
                return res.status(401).json({ error: 'rossz a jelszó' });
            }
        });
    });
};

// logout
const logout = (req, res) => {
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    });
    return res.status(200).json({ message: 'Sikeres kijelentkezés!' });
};

// login teszt
const test = (req, res) => {
    return res.status(200).json({ message: 'bent vagy' });
};

module.exports = { register, login, logout, test };