const dotenv = require("dotenv");
dotenv.config();
const app = require('./app');


const connectDB = require("./config/database");
const { connectRedis } = require('./config/redis');


const PORT = process.env.PORT || 8000;

const initialize = async () => {
        await connectDB();
        await connectRedis();

    app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
    });
}

initialize();



