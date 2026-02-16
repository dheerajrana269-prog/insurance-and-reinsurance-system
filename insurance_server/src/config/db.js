const mongoose = require('mongoose');

// module.exports = async () => {
//     await mongoose.connect(process.env.MONGODB_URL);
//     console.log("Database connected");
// }

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to Database');
    } catch (error) {
        console.log('Unable to connect to Database');
        console.log('Error: ', error);
        process.exit(1);
    }
} 

module.exports = connectToDb;