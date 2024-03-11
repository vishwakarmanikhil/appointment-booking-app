const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/connection.js');
const { sendSuccess, sendError } = require('../utils/response');

// Add Appointment
router.post('/add', async (req, res) => {
    const { user_id, doctor_id, date, start_time, end_time, status } = req.body;
    // console.log('req.body', req.body)

    if (!user_id || !doctor_id || !start_time || !date || !end_time || !status) {
        return sendError(res, 'All fields are required', 400);
    }

    try {
        getConnection((conn) => {
            const qry = 'INSERT INTO appointment (user_id, doctor_id, date, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?)';
            const values = [user_id, doctor_id, date, start_time, end_time, status];

            conn.query(qry, values, (err, result) => {
                conn.release();

                if (err) {
                    console.log(err);
                    return sendError(res, 'Internal Server Error', 500, err);
                }

                sendSuccess(res, 'Appointment successfully added', result);
            });
        });
    } catch (err) {
        console.log(err);
        sendError(res, 'Internal Server Error', 500, err);
    }
});

// Update Appointment
router.post('/update', async (req, res) => {
    const { appointment_id, user_id, doctor_id, start_time, end_time, status } = req.body;

    if (!appointment_id || !user_id || !doctor_id || !start_time || !end_time || !status) {
        return sendError(res, 'All fields are required', 400);
    }

    try {
        getConnection((conn) => {
            const qry = 'UPDATE appointment SET user_id=?, doctor_id=?, start_time=?, end_time=?, status=? WHERE appointment_id=?';
            const values = [user_id, doctor_id, start_time, end_time, status, appointment_id];

            conn.query(qry, values, (err, result) => {
                conn.release();

                if (err) {
                    console.log(err);
                    return sendError(res, 'Internal Server Error', 500, err);
                }

                sendSuccess(res, 'Appointment successfully updated', result);
            });
        });
    } catch (err) {
        console.log(err);
        sendError(res, 'Internal Server Error', 500, err);
    }
});


// Get Appointments for a specific user
router.post('/get', async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return sendError(res, 'User ID is required', 400);
    }

    try {
        getConnection((conn) => {
            const qry = 'SELECT * FROM appointment WHERE user_id = ?';
            const values = [user_id];

            conn.query(qry, values, (err, result) => {
                conn.release();

                if (err) {
                    console.log(err);
                    return sendError(res, 'Internal Server Error', 500, err);
                }

                sendSuccess(res, 'User Appointments fetched successfully', result);
            });
        });
    } catch (err) {
        console.log(err);
        sendError(res, 'Internal Server Error', 500, err);
    }
});


// Cancel Appointment
router.post('/cancel', async (req, res) => {
    const { appointment_id } = req.body;

    if (!appointment_id) {
        return sendError(res, 'Appointment ID is required', 400);
    }

    try {
        getConnection((conn) => {
            const qry = 'UPDATE appointment SET status="canceled" WHERE appointment_id=?';
            const values = [appointment_id];

            conn.query(qry, values, (err, result) => {
                conn.release();

                if (err) {
                    console.log(err);
                    return sendError(res, 'Internal Server Error', 500, err);
                }

                sendSuccess(res, 'Appointment successfully canceled', result);
            });
        });
    } catch (err) {
        console.log(err);
        sendError(res, 'Internal Server Error', 500, err);
    }
});

module.exports = router;


module.exports = router;

