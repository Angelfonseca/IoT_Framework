const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const user = require('./src/models/user.model');
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost/IoT_Framework', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api/devices', require('./src/routes/devices.routes'));
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
// });

app.use('/api/users', require('./src/routes/users.routes'))

app.use('/api/data', require('./src/routes/data.routes'))
app.use('/api/creator', require('./src/routes/creator.routes'));
app.use('/api/filters', require('./src/routes/filters.routes'));
app.use('/api/alerts', require('./src/routes/alerts.routes'));
app.use('/api/modules', require('./src/routes/modules.routes'));

app.use(cors());
app.use(express.json());

const PORT = parseInt(process.env.PORT, 10) || 3000;
async function setup() {
    try {
        await mongoose.connect('mongodb://localhost/IoT_Framework', { useNewUrlParser: true, useUnifiedTopology: true });
        const users = await user.find({});
        if (users.length) {
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
            return;
        }
        const defaultUser = await user.create({username: 'admin', name: 'Admin', password: 'admin'});
        console.log('Default user created', defaultUser);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error setting up app', error);
    }
}

setup();