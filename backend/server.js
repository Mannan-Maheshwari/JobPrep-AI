require("dotenv").config();
const app = require("./src/app");
const ConnecttoDB = require("./src/config/database");
const DB = require("./src/config/database");


ConnecttoDB();

app.listen(3020, () => {
    console.log("Server is running on port 3020");

})