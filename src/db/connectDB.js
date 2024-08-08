const mongoose = require("mongoose");
const DB_NAME = require("../constants");
const connectdb = async () => {
    try {
        console.log(process.env.MONGODB_URL);
        const connectionInstance = await mongoose.connect(
            process.env.MONGODB_URL + "/" + DB_NAME
        );
        console.log(
            `\n mongodb connected!! Host: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
};
module.exports = connectdb;
