const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/connection.js');
const { sendSuccess, sendError } = require('../utils/response');

router.get('/doctor_details_availability', async (req, res) => {
    try {
        getConnection((conn) => {
            const qry = `
                SELECT u.*, da.date, da.start_time, da.end_time, da.interval_minute
                FROM user u
                JOIN doctor_availability da ON u.id = da.doctor_id
            `;

            conn.query(qry, (err, result) => {
                conn.release();

                if (err) {
                    console.log(err);
                    return sendError(res, 'Internal Server Error', 500, err);
                }

                sendSuccess(res, 'All Doctors and Availability Fetched Successfully', result);
            });
        });
    } catch (err) {
        console.log(err);
        sendError(res, 'Internal Server Error', 500, err);
    }
});

module.exports = router;