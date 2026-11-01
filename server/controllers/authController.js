const bcrypt = require('bcrypt');
const DataBasePool = require('../config/db');
const jwt = require('jsonwebtoken');
   let registerUser = async (req, res) => {
   const { name, email, password } = req.body;
    try { 
    const hashedPassword = await bcrypt.hash(password, 10);

        const result = await DataBasePool.query('INSERT INTO users (name, email, passwordhash) VALUES ($1, $2, $3) RETURNING userid, name, email, role', [name, email, hashedPassword]);
        const token = jwt.sign({ userId: result.rows[0].userid, name: result.rows[0].name, email: result.rows[0].email, role: result.rows[0].role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ ...result.rows[0], token });
    } catch (error) {
        if (error.code === '23505') { 
return res.status(409).send('Email already exists');        }
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
}
let LoginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await DataBasePool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).send('Invalid email or password');
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.passwordhash);
        if (!isMatch) {
            return res.status(401).send('Invalid email or password');
        }
        const token = jwt.sign({ userId: user.userid, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', user: { userId: user.userid, name: user.name, email: user.email, role: user.role }, token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
};
module.exports = {
    registerUser,
    LoginUser
};