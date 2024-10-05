const mongoose = require('mongoose');
const serverConfig = require('./serverConfig');

const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(serverConfig.DB_URL);
        if(connection){
            console.log(`Connected to MongDB at ${connection.host}`);
        }
    } catch (e) { 
        console.log(e);
        process.exit(1);
    }
}

module.exports = connectDB;