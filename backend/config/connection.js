const pool = require('./db.js');

// Database connection function to avoid duplication
const getConnection = (callback) => {
    pool.getConnection((err, conn) => {
        if (err) throw err;
        callback(conn);
    });
};

module.exports = { getConnection };