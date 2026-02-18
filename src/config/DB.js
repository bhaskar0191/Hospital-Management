import mongose from 'mongoose';
import dotenv from 'dotenv';

const connectDB = async () => {
    try {
        const conn = await mongose.connect(process.env.MONOGOSE_URI);
        console.log(`MongoDB Connected succeessfully: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
export default connectDB;