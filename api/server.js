const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const redisClient = require('./redis');
const socket = require('./socket');
const port = process.env.PORT || 8000;
const app = express();

const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const messageRoutes = require('./routes/message');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api', userRoutes, chatRoutes, messageRoutes);

const server = app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    try {
        await sequelize.authenticate();
        console.log('Database connected');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

socket(server);
