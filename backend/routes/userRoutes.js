const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/connection.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendSuccess, sendError } = require('../utils/response');
const crypto = require('crypto');

const generateRandomKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Hashing a password asynchronously
const hashPassword = async (password) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return sendError(res, 'All fields are required', 400);
    }

    try {
        // Hash the password asynchronously
        const hashedPassword = await hashPassword(password);

        getConnection((conn) => {
            const selectQry = 'SELECT * FROM user WHERE email = ?';
            conn.query(selectQry, [email], async (err, result) => {
                if (err) {
                    conn.release();
                    return sendError(res, 'Internal Server Error', 500, err);
                }

                if (result.length > 0) {
                    conn.release();
                    return sendSuccess(res, 'User already exists', { isExisted: 1 });
                }

                const insertQry = 'INSERT INTO user (name, email, password, role) VALUES (?, ?, ?, ?)';
                const values = [name, email, hashedPassword, role];

                conn.query(insertQry, values, (err, result) => {
                    conn.release();

                    if (err) {
                        return sendError(res, 'Internal Server Error', 500, err);
                    }

                    // Extract necessary information and send as response
                    const response = {
                        affectedRows: result.affectedRows,
                        insertId: result.insertId,
                        message: 'User successfully signed up',
                    };

                    sendSuccess(res, response.message, response);
                });
            });
        });
    } catch (err) {
        console.error('Error during signup:', err);
        sendError(res, 'Internal Server Error', 500, err);
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return sendError(res, 'Email and password are required', 400);
    }

    try {
        getConnection((conn) => {
            const qry = 'SELECT id, password FROM user WHERE email = ?';
            conn.query(qry, [email], async (err, result) => {
                conn.release();

                if (err) {
                    console.log(err);
                    sendError(res, 'Internal Server Error', 500, err);
                }

                if (result.length === 0) {
                    return sendSuccess(res, 'Invalid credentials', { isInvalid: 1 });
                }

                const user = result[0];
                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    return sendSuccess(res, 'Invalid credentials', { isInvalid: 1 });
                }

                const token = jwt.sign({ userId: user.id }, generateRandomKey(), { expiresIn: '1h' });

                sendSuccess(res, 'User successfully signed up', { token, user: { id: user.id } });
            });
        });
    } catch (err) {
        console.log(err);
        sendError(res, 'Internal Server Error', 500, err);
    }
});

router.post('/user_details', async (req, res) => {
    try {
        const { id } = req.body;

        getConnection((conn) => {
            const qry = 'SELECT id, name, email, role FROM user WHERE id = ?';
            conn.query(qry, [id], (err, result) => {
                conn.release();

                if (err) {
                    console.log(err);
                    sendError(res, 'Internal Server Error', 500, err);
                }

                if (result.length === 0) {
                    return sendError(res, 'User not found', 404);
                }

                const user = result[0];
                sendSuccess(res, 'User details', {...user});
            });
        });
    } catch (err) {
        console.log(err);
        sendError(res, 'Internal Server Error', 500, err);
    }
});

router.put('/update_user', async (req, res) => {
    const userId = req.user.userId;
    const { name, password } = req.body;

    try {
        // Hash the new password if provided
        const hashedPassword = password ? await hashPassword(password) : undefined;

        getConnection((conn) => {

            const selectQry = 'SELECT * FROM user WHERE id = ?';
            conn.query(selectQry, [userId], async (err, result) => {
                if (err) {
                    conn.release();
                    return sendError(res, 'Internal Server Error', 500, err);
                }

                if (result.length === 0) {
                    conn.release();
                    return sendError(res, 'User not found', 404);
                }

                const user = result[0];

                // Update user details
                const updateQry = 'UPDATE user SET name = ?, password = ? WHERE id = ?';
                const updateValues = [name || user.name, hashedPassword || user.password, userId];

                conn.query(updateQry, updateValues, (err, result) => {
                    conn.release();

                    if (err) {
                        return sendError(res, 'Internal Server Error', 500, err);
                    }

                    sendSuccess(res, 'User details updated successfully', result);
                });
            });
        });
    } catch (err) {
        console.error('Error during user update:', err);
        sendError(res, 'Internal Server Error', 500, err);
    }
});


module.exports = router;