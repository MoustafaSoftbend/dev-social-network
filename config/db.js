const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI')

const connectDb = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology:true
        })
        console.log('MongoDB connected successfully')
    }catch(err) {
        console.error(err);
        // Exit Process with failure
        process.exit(1);
    }
}


module.exports = connectDb;