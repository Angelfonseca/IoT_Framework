const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost/IoT_Framework', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/devices', require('./src/routes/devices.routes'));

app.use('/api/users', require('./src/routes/users.routes'))

app.use('/api/data', require('./src/routes/data.routes'))
app.use('/api/creator', require('./src/routes/creator.routes'));


const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
