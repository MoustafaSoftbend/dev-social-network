const express = require('express');
const connectDb = require('./config/db');
const colors = require('colors');
const path = require('path')

const app = express();


//  Connect database
connectDb();

// Init Middleware
app.use(express.json());


const users = require('./routes/api/users');
const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

//  Define Routes
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/posts', posts);
app.use('/api/profile', profile);

if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Sevrer running on port: ${PORT}`.rainbow)
})


process.on('unhandeledRejection', function(err, promise) {
    console.error(`Error: ${err.message}`.red);

    // Close server and Exit process
    server.close(() => process.exit(1))
})