require("dotenv").config();
const app = require("./src/app");
const ConnecttoDB = require("./src/config/database");
const DB = require("./src/config/database");


ConnecttoDB();

const PORT = process.env.PORT || 3020;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})