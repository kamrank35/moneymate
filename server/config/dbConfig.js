// const mg = require('mongoose')

// mg.connect(process.env.mongo_url)

// const connectionresult = mg.connection;

// connectionresult.on('error',() =>{ console.log('connection error: ')})
// connectionresult.on('connected', () =>{console.log('Mongo DB connected successfully')})

// module.exports = connectionresult;

require('dotenv').config();
const mg = require('mongoose');

const connectDB = async () => {
    try {
        await mg.connect(process.env.mongo_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Mongo DB connected successfully');
    } catch (err) {
        console.error('Connection error:', err);
        process.exit(1);
    }
};

connectDB();

const connectionresult = mg.connection;

connectionresult.on('disconnected', () => {
    console.log('Mongo DB disconnected');
});

connectionresult.on('reconnected', () => {
    console.log('Mongo DB reconnected');
});

module.exports = connectionresult;