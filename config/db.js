const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const colors = require('colors');

const connectDb = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useCreateIndex: true
        })
        console.log('MongoDB connected successfully'.yellow.underline)
    }catch(err) {
        console.error(`${err}`.red);
        // Exit Process with failure
        process.exit(1);
    }
}


module.exports = connectDb;