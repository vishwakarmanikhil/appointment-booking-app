const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/connection.js');
const { sendSuccess, sendError } = require('../utils/response');

router.post('/add', async (req, res) => {
    const { doctor_id, date, start_time, end_time, interval_minute } = req.body;

    if (!doctor_id || !date || !start_time || !end_time || !interval_minute) {
        return sendError(res, 'All fields are required', 400);
    }

    try {
        getConnection((conn) => {
            const qry = 'INSERT INTO doctor_availability (doctor_id, date, start_time, end_time, interval_minute) VALUES (?, ?, ?, ?, ?)';
            const values = [doctor_id, date, start_time, end_time, interval_minute];

            conn.query(qry, values, (err, result) => {
                conn.release();

                if (err) {
                    console.log(err);
                    return sendError(res, 'Internal Server Error', 500, err);
                }

                sendSuccess(res, 'Availability successfully added', result);
            });
        });
    } catch (err) {
        console.log(err);
        sendError(res, 'Internal Server Error', 500, err);
    }
});

router.post('/update', async (req, res) => {
    const availability_id = req.body.availability_id;
    const { doctor_id, date, start_time, end_time, interval_minute } = req.body;

    if (!doctor_id || !date || !start_time || !end_time || !interval_minute) {
        return sendError(res, 'All fields are required', 400);
    }

    try {
        getConnection((conn) => {
            const qry = 'UPDATE doctor_availability SET doctor_id=?, date=?, start_time=?, end_time=?, interval_minute=? WHERE availability_id=?';
            const values = [doctor_id, date, start_time, end_time, interval_minute, availability_id];

            conn.query(qry, values, (err, result) => {
                conn.release();

                if (err) {
                    console.log(err);
                    return sendError(res, 'Internal Server Error', 500, err);
                }

                sendSuccess(res, 'Availability successfully updated', result);
            });
        });
    } catch (err) {
        console.log(err);
        sendError(res, 'Internal Server Error', 500, err);
    }
});

router.post('/get', async (req, res) => {
    const doctor_id = req.body.doctor_id;
    try {
        getConnection((conn) => {
            const qry = 'SELECT * FROM doctor_availability WHERE doctor_id=?';
            conn.query(qry, [doctor_id], (err, result) => {
                conn.release();

                if (err) {
                    console.log(err);
                    return sendError(res, 'Internal Server Error', 500, err);
                }

                if (result.length === 0) {
                    return sendSuccess(res, 'Availability not found', []);
                }

                const availability = result;
                sendSuccess(res, 'Availability successfully retrieved', availability);
            });
        });
    } catch (err) {
        console.log(err);
        sendError(res, 'Internal Server Error', 500, err);
    }
});

module.exports = router;