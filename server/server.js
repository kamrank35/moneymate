require('dotenv').config()
const exp = require('express')
const app = exp()
const cors = require('cors')

app.use(cors())
app.use(exp.json())
const dbConfig = require("./config/dbConfig")
const usersRoute = require("./routes/usersRoute")
const transactionRoute = require("./routes/transactionRoutes")

app.use('/api/users',usersRoute)
app.use('/api/transactions',transactionRoute)

const PORT = process.env.PORT || 8000 ;

app.listen(PORT,() => {
    console.log(`Server started on ${PORT}`)
})


// const express = require('express');
// const app = express();
// const dotenv = require('dotenv');
// const dbConfig = require("./config/dbConfig");
// const usersRoute = require("./routes/usersRoute");
// const transactionRoute = require("./routes/transactionRoutes");

// // Load environment variables
// dotenv.config();

// // Connect to the database
// dbConfig.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database:', err);
//         process.exit(1);
//     }
//     console.log('Connected to the database');
// });

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/users', usersRoute);
// app.use('/api/transactions', transactionRoute);

// // Error handling middleware
// app.use((err, req, res, next) => {
//     console.error('Error:', err);
//     res.status(500).send('Internal Server Error');
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server started on ${PORT}`);
// });

// // Shutdown function
// process.on('SIGINT', () => {
//     console.log('Shutting down the server');
//     dbConfig.disconnect();
//     process.exit(0);
// });