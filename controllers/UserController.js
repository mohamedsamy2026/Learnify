const DataBasePool = require('../config/db');
let getUsers = async (req, res) => {
try {
        const result = await DataBasePool.query('SELECT UserId, name, email FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
}
const getMyProfile = async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await DataBasePool.query(
            `SELECT UserId, name, email, role
             FROM Users
             WHERE UserId = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Error fetching profile:', error);

        return res.status(500).json({
            message: 'Error fetching profile'
        });
    }
};

const updateMyProfile = async (req, res) => {
    const userId = req.user.userId;
    const { name, email } = req.body;

    try {
        const result = await DataBasePool.query(
            `UPDATE Users
             SET name = COALESCE($1, name),
                 email = COALESCE($2, email)
             WHERE UserId = $3
             RETURNING UserId, name, email, role`,
            [name ?? null, email ?? null, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: result.rows[0]
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                message: 'Email already in use'
            });
        }

        console.error('Error updating profile:', error);

        return res.status(500).json({
            message: 'Error updating profile'
        });
    }
};
   module.exports = { getUsers, getMyProfile, updateMyProfile };