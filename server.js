const app = require("./app");
const dotenv = require("dotenv");

dotenv.config();

connectDB();

const PORT = 5000;

app.listen(process.env.PORT || PORT, ()=> {
    console.log("Server is running on the port " + PORT);
})