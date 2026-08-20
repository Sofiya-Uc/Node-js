//mongoose is used to communicate with the database mongoDB
// It also defines data types used in the model made
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`\n Connected successfully!!! ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log('Error occurred:', error);
        process.exit(1)
    }
}

export default connectDB;