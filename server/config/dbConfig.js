const mg = require('mongoose');

const connectDB = async () => {
    try {
        await mg.connect(process.env.mongo_url);
        console.log('Mongo DB connected successfully');
    } catch (err) {
        console.error('Connection error:', err);
        process.exit(1);
    }
};

connectDB();

module.exports = mg.connection;