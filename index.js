require("dotenv").config();

const connectdb = require("./src/db/connectDB");
const app = require("./src/app");
connectdb()
    .then(() => {
        app.on("error", (error) => {
            console.log(error);
            throw error;
        });
        app.listen(process.env.PORT || 8000, () => {
            console.log(
                `Server running on : http::/localhost:${process.env.PORT}/`
            );
        });
    })
    .catch((err) => {
        console.log("mongo connect failed");
    });
