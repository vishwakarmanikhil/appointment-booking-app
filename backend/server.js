const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const customRoutes = require('./routes/handler');
const cors = require('cors');
// const path = require('path'); // Import path module
require('dotenv/config');

const app = express();

// Allow requests from specific origins
app.use(cors({
    origin: '*', // Adjust to specific origins if needed
    optionsSuccessStatus: 200,
}));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/api/user', userRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/custom', customRoutes);

const PORT = process.env.PORT || 4000; // backend routing port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
