const express = require('express');
const connectDb = require('./config/db');
const colors = require('colors');

const app = express();


//  Connect database
connectDb();

// Init Middleware
app.use(express.json());

app.get('/', (req, res) => res.send('API running'))

const users = require('./routes/api/users');
const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

//  Define Routes
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/posts', posts);
app.use('/api/profile', profile);


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Sevrer running on port: ${PORT}`.rainbow)
})